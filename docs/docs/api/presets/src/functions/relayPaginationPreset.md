[**@org/source**](../../../README.md)

***

[@org/source](../../../modules.md) / [presets/src](../README.md) / relayPaginationPreset

# Function: relayPaginationPreset()

> **relayPaginationPreset**(`document`, `relayFields`): `DocumentNode`

Defined in: [presets/src/lib/relay-pagination-preset.ts:13](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/presets/src/lib/relay-pagination-preset.ts#L13)

Rewrites Relay connections:
- edges { node { ... } }
- pageInfo { hasNextPage hasPreviousPage startCursor endCursor }

## Parameters

### document

`DocumentNode`

### relayFields

`Set`\<`FieldNode`\>

## Returns

`DocumentNode`
