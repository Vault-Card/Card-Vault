import argparse
import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from tqdm import tqdm

TABLE_NAME = "scryfall-data"

class ScryfallDb:
    def __init__(self, dyn_resource, table_name: str) -> None:
        self.dyn_resource = dyn_resource

        if not self.__load_table(table_name):
            self.__create_table(table_name)

    def __load_table(self, table_name: str) -> bool:
        try:
            table = self.dyn_resource.Table(table_name)
            table.load()
        except ClientError as err:
            if err.response["Error"]["Code"] == "ResourceNotFoundException":
                return False
            
            raise
        else:
            self.table = table
            return True

    def __create_table(self, table_name: str) -> None:
        try:
            self.table = self.dyn_resource.create_table(
                TableName=table_name,
                KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
                AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
                BillingMode="PAY_PER_REQUEST"
            )
            
            self.table.wait_until_exists()
        except ClientError as err:
            raise

    def add_card(self, card: dict) -> None:
        try:
            self.table.put_item(Item=card)
        except ClientError as err:
            raise

    def add_cards(self, cards: list[dict]) -> None:
        try:
            with self.table.batch_writer() as writer:
                for card in tqdm(cards):
                    writer.put_item(Item=card)
        except ClientError as err:
            raise

def load_file(filepath: str) -> list[dict]:
    with open(filepath, "r", encoding="utf8") as file:
        cards = json.load(file, parse_float=Decimal)

        return cards

def main(args):
    cards = load_file(args.filepath)

    dyn_resource = boto3.resource("dynamodb", region_name="us-east-2")
    scryfalldb = ScryfallDb(dyn_resource, TABLE_NAME)

    scryfalldb.add_cards(cards)
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("filepath", help="The path to the bulk card data to import.")
    
    main(parser.parse_args())