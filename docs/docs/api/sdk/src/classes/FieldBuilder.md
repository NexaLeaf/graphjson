[**@org/source**](../../../README.md)

***

[@org/source](../../../modules.md) / [sdk/src](../README.md) / FieldBuilder

# Class: FieldBuilder

Defined in: [sdk/src/lib/query.ts:40](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L40)

## Constructors

### Constructor

> **new FieldBuilder**(): `FieldBuilder`

#### Returns

`FieldBuilder`

## Methods

### alias()

> **alias**(`name`): `FieldBuilder`

Defined in: [sdk/src/lib/query.ts:67](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L67)

#### Parameters

##### name

`string`

#### Returns

`FieldBuilder`

***

### args()

> **args**(`args`): `FieldBuilder`

Defined in: [sdk/src/lib/query.ts:46](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L46)

#### Parameters

##### args

`Record`\<`string`, [`JsonArg`](../../../json-dsl/src/type-aliases/JsonArg.md)\>

#### Returns

`FieldBuilder`

***

### build()

> **build**(): [`JsonField`](../../../json-dsl/src/interfaces/JsonField.md)

Defined in: [sdk/src/lib/query.ts:99](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L99)

#### Returns

[`JsonField`](../../../json-dsl/src/interfaces/JsonField.md)

***

### directive()

> **directive**(`name`, `args`): `FieldBuilder`

Defined in: [sdk/src/lib/query.ts:74](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L74)

#### Parameters

##### name

`string`

##### args

`DirectiveArgs` = `{}`

#### Returns

`FieldBuilder`

***

### fragment()

> **fragment**(`name`): `FieldBuilder`

Defined in: [sdk/src/lib/query.ts:91](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L91)

#### Parameters

##### name

`string`

#### Returns

`FieldBuilder`

***

### paginate()

> **paginate**(`mode`): `FieldBuilder`

Defined in: [sdk/src/lib/query.ts:82](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L82)

#### Parameters

##### mode

`"relay"` | `"cursor"` | `"offset"`

#### Returns

`FieldBuilder`

***

### select()

> **select**(`select`): `FieldBuilder`

Defined in: [sdk/src/lib/query.ts:53](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L53)

#### Parameters

##### select

`Record`\<`string`, `Selection`\>

#### Returns

`FieldBuilder`

***

### toJSON()

> **toJSON**(): [`JsonField`](../../../json-dsl/src/interfaces/JsonField.md)

Defined in: [sdk/src/lib/query.ts:110](https://github.com/NexaLeaf/graphjson/blob/4b6f2ccd23141ae878c04a4a54867977df5052af/libs/sdk/src/lib/query.ts#L110)

#### Returns

[`JsonField`](../../../json-dsl/src/interfaces/JsonField.md)
