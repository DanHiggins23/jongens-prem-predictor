import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Predictions: a
    .model({
      user: a.string(),
      prediction: a.string(),
      isDraft: a.boolean(),
      expectedGoals: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
