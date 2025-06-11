const amplifyConfig = {
  auth: {
    user_pool_id: "us-west-2_vYo9733aH",
    aws_region: "us-west-2",
    user_pool_client_id: "3brafu5quo3m63fsghm2sb10f7",
    identity_pool_id: "us-west-2:e9654dd4-eb29-46b0-9cf2-8beae5bfa80e",
    mfa_methods: [],
    standard_required_attributes: [
      "email"
    ],
    username_attributes: [
      "email"
    ],
    user_verification_types: [
      "email"
    ],
    groups: [],
    mfa_configuration: "NONE",
    password_policy: {
      "min_length": 8,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true,
      "require_uppercase": true
    },
    unauthenticated_identities_enabled: true
  },
  version: "1.4"
};

export default amplifyConfig;

