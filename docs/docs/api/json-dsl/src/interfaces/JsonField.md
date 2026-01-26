[**@org/source**](../../../README.md)

***

[@org/source](../../../modules.md) / [json-dsl/src](../README.md) / JsonField

# Interface: JsonField

Defined in: [json-dsl/src/lib/types.ts:22](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/json-dsl/src/lib/types.ts#L22)

## Properties

### alias?

> `optional` **alias**: `string`

Defined in: [json-dsl/src/lib/types.ts:27](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/json-dsl/src/lib/types.ts#L27)

***

### args?

> `optional` **args**: `Record`\<`string`, [`JsonArg`](../type-aliases/JsonArg.md)\>

Defined in: [json-dsl/src/lib/types.ts:23](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/json-dsl/src/lib/types.ts#L23)

***

### directives?

> `optional` **directives**: `Record`\<`string`, `Record`\<`string`, [`JsonArg`](../type-aliases/JsonArg.md)\>\>

Defined in: [json-dsl/src/lib/types.ts:28](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/json-dsl/src/lib/types.ts#L28)

***

### paginate?

> `optional` **paginate**: `"relay"` \| `"cursor"` \| `"offset"`

Defined in: [json-dsl/src/lib/types.ts:29](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/json-dsl/src/lib/types.ts#L29)

***

### select?

> `optional` **select**: `Record`\<`string`, `true` \| `JsonField` \| \{\[`fragment`: `` `...${string}` ``\]: `true`; \}\>

Defined in: [json-dsl/src/lib/types.ts:24](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/json-dsl/src/lib/types.ts#L24)
