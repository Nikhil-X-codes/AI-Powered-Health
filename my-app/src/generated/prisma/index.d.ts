
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>
/**
 * Model reports
 * 
 */
export type reports = $Result.DefaultSelection<Prisma.$reportsPayload>
/**
 * Model health_metrics
 * 
 */
export type health_metrics = $Result.DefaultSelection<Prisma.$health_metricsPayload>
/**
 * Model prescriptions
 * 
 */
export type prescriptions = $Result.DefaultSelection<Prisma.$prescriptionsPayload>
/**
 * Model medicines
 * 
 */
export type medicines = $Result.DefaultSelection<Prisma.$medicinesPayload>
/**
 * Model chat_history
 * 
 */
export type chat_history = $Result.DefaultSelection<Prisma.$chat_historyPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reports`: Exposes CRUD operations for the **reports** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.reports.findMany()
    * ```
    */
  get reports(): Prisma.reportsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.health_metrics`: Exposes CRUD operations for the **health_metrics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Health_metrics
    * const health_metrics = await prisma.health_metrics.findMany()
    * ```
    */
  get health_metrics(): Prisma.health_metricsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.prescriptions`: Exposes CRUD operations for the **prescriptions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Prescriptions
    * const prescriptions = await prisma.prescriptions.findMany()
    * ```
    */
  get prescriptions(): Prisma.prescriptionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.medicines`: Exposes CRUD operations for the **medicines** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Medicines
    * const medicines = await prisma.medicines.findMany()
    * ```
    */
  get medicines(): Prisma.medicinesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chat_history`: Exposes CRUD operations for the **chat_history** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Chat_histories
    * const chat_histories = await prisma.chat_history.findMany()
    * ```
    */
  get chat_history(): Prisma.chat_historyDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    users: 'users',
    reports: 'reports',
    health_metrics: 'health_metrics',
    prescriptions: 'prescriptions',
    medicines: 'medicines',
    chat_history: 'chat_history'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "users" | "reports" | "health_metrics" | "prescriptions" | "medicines" | "chat_history"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      reports: {
        payload: Prisma.$reportsPayload<ExtArgs>
        fields: Prisma.reportsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.reportsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.reportsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          findFirst: {
            args: Prisma.reportsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.reportsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          findMany: {
            args: Prisma.reportsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>[]
          }
          create: {
            args: Prisma.reportsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          createMany: {
            args: Prisma.reportsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.reportsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>[]
          }
          delete: {
            args: Prisma.reportsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          update: {
            args: Prisma.reportsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          deleteMany: {
            args: Prisma.reportsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.reportsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.reportsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>[]
          }
          upsert: {
            args: Prisma.reportsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          aggregate: {
            args: Prisma.ReportsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReports>
          }
          groupBy: {
            args: Prisma.reportsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportsGroupByOutputType>[]
          }
          count: {
            args: Prisma.reportsCountArgs<ExtArgs>
            result: $Utils.Optional<ReportsCountAggregateOutputType> | number
          }
        }
      }
      health_metrics: {
        payload: Prisma.$health_metricsPayload<ExtArgs>
        fields: Prisma.health_metricsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.health_metricsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.health_metricsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>
          }
          findFirst: {
            args: Prisma.health_metricsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.health_metricsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>
          }
          findMany: {
            args: Prisma.health_metricsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>[]
          }
          create: {
            args: Prisma.health_metricsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>
          }
          createMany: {
            args: Prisma.health_metricsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.health_metricsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>[]
          }
          delete: {
            args: Prisma.health_metricsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>
          }
          update: {
            args: Prisma.health_metricsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>
          }
          deleteMany: {
            args: Prisma.health_metricsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.health_metricsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.health_metricsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>[]
          }
          upsert: {
            args: Prisma.health_metricsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$health_metricsPayload>
          }
          aggregate: {
            args: Prisma.Health_metricsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHealth_metrics>
          }
          groupBy: {
            args: Prisma.health_metricsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Health_metricsGroupByOutputType>[]
          }
          count: {
            args: Prisma.health_metricsCountArgs<ExtArgs>
            result: $Utils.Optional<Health_metricsCountAggregateOutputType> | number
          }
        }
      }
      prescriptions: {
        payload: Prisma.$prescriptionsPayload<ExtArgs>
        fields: Prisma.prescriptionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.prescriptionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.prescriptionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>
          }
          findFirst: {
            args: Prisma.prescriptionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.prescriptionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>
          }
          findMany: {
            args: Prisma.prescriptionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>[]
          }
          create: {
            args: Prisma.prescriptionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>
          }
          createMany: {
            args: Prisma.prescriptionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.prescriptionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>[]
          }
          delete: {
            args: Prisma.prescriptionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>
          }
          update: {
            args: Prisma.prescriptionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>
          }
          deleteMany: {
            args: Prisma.prescriptionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.prescriptionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.prescriptionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>[]
          }
          upsert: {
            args: Prisma.prescriptionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$prescriptionsPayload>
          }
          aggregate: {
            args: Prisma.PrescriptionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrescriptions>
          }
          groupBy: {
            args: Prisma.prescriptionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrescriptionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.prescriptionsCountArgs<ExtArgs>
            result: $Utils.Optional<PrescriptionsCountAggregateOutputType> | number
          }
        }
      }
      medicines: {
        payload: Prisma.$medicinesPayload<ExtArgs>
        fields: Prisma.medicinesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.medicinesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.medicinesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>
          }
          findFirst: {
            args: Prisma.medicinesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.medicinesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>
          }
          findMany: {
            args: Prisma.medicinesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>[]
          }
          create: {
            args: Prisma.medicinesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>
          }
          createMany: {
            args: Prisma.medicinesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.medicinesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>[]
          }
          delete: {
            args: Prisma.medicinesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>
          }
          update: {
            args: Prisma.medicinesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>
          }
          deleteMany: {
            args: Prisma.medicinesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.medicinesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.medicinesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>[]
          }
          upsert: {
            args: Prisma.medicinesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$medicinesPayload>
          }
          aggregate: {
            args: Prisma.MedicinesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedicines>
          }
          groupBy: {
            args: Prisma.medicinesGroupByArgs<ExtArgs>
            result: $Utils.Optional<MedicinesGroupByOutputType>[]
          }
          count: {
            args: Prisma.medicinesCountArgs<ExtArgs>
            result: $Utils.Optional<MedicinesCountAggregateOutputType> | number
          }
        }
      }
      chat_history: {
        payload: Prisma.$chat_historyPayload<ExtArgs>
        fields: Prisma.chat_historyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.chat_historyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.chat_historyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>
          }
          findFirst: {
            args: Prisma.chat_historyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.chat_historyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>
          }
          findMany: {
            args: Prisma.chat_historyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>[]
          }
          create: {
            args: Prisma.chat_historyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>
          }
          createMany: {
            args: Prisma.chat_historyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.chat_historyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>[]
          }
          delete: {
            args: Prisma.chat_historyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>
          }
          update: {
            args: Prisma.chat_historyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>
          }
          deleteMany: {
            args: Prisma.chat_historyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.chat_historyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.chat_historyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>[]
          }
          upsert: {
            args: Prisma.chat_historyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$chat_historyPayload>
          }
          aggregate: {
            args: Prisma.Chat_historyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChat_history>
          }
          groupBy: {
            args: Prisma.chat_historyGroupByArgs<ExtArgs>
            result: $Utils.Optional<Chat_historyGroupByOutputType>[]
          }
          count: {
            args: Prisma.chat_historyCountArgs<ExtArgs>
            result: $Utils.Optional<Chat_historyCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    users?: usersOmit
    reports?: reportsOmit
    health_metrics?: health_metricsOmit
    prescriptions?: prescriptionsOmit
    medicines?: medicinesOmit
    chat_history?: chat_historyOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    reports: number
    prescriptions: number
    chat_history: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | UsersCountOutputTypeCountReportsArgs
    prescriptions?: boolean | UsersCountOutputTypeCountPrescriptionsArgs
    chat_history?: boolean | UsersCountOutputTypeCountChat_historyArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reportsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountPrescriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: prescriptionsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountChat_historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chat_historyWhereInput
  }


  /**
   * Count Type ReportsCountOutputType
   */

  export type ReportsCountOutputType = {
    health_metrics: number
  }

  export type ReportsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    health_metrics?: boolean | ReportsCountOutputTypeCountHealth_metricsArgs
  }

  // Custom InputTypes
  /**
   * ReportsCountOutputType without action
   */
  export type ReportsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReportsCountOutputType
     */
    select?: ReportsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReportsCountOutputType without action
   */
  export type ReportsCountOutputTypeCountHealth_metricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: health_metricsWhereInput
  }


  /**
   * Count Type PrescriptionsCountOutputType
   */

  export type PrescriptionsCountOutputType = {
    medicines: number
  }

  export type PrescriptionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    medicines?: boolean | PrescriptionsCountOutputTypeCountMedicinesArgs
  }

  // Custom InputTypes
  /**
   * PrescriptionsCountOutputType without action
   */
  export type PrescriptionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrescriptionsCountOutputType
     */
    select?: PrescriptionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PrescriptionsCountOutputType without action
   */
  export type PrescriptionsCountOutputTypeCountMedicinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: medicinesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    created_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    created_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    created_at: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    created_at?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    created_at?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    created_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    created_at: Date
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
    reports?: boolean | users$reportsArgs<ExtArgs>
    prescriptions?: boolean | users$prescriptionsArgs<ExtArgs>
    chat_history?: boolean | users$chat_historyArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    created_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "created_at", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | users$reportsArgs<ExtArgs>
    prescriptions?: boolean | users$prescriptionsArgs<ExtArgs>
    chat_history?: boolean | users$chat_historyArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      reports: Prisma.$reportsPayload<ExtArgs>[]
      prescriptions: Prisma.$prescriptionsPayload<ExtArgs>[]
      chat_history: Prisma.$chat_historyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      created_at: Date
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reports<T extends users$reportsArgs<ExtArgs> = {}>(args?: Subset<T, users$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    prescriptions<T extends users$prescriptionsArgs<ExtArgs> = {}>(args?: Subset<T, users$prescriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chat_history<T extends users$chat_historyArgs<ExtArgs> = {}>(args?: Subset<T, users$chat_historyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'String'>
    readonly name: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly password: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.reports
   */
  export type users$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    where?: reportsWhereInput
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    cursor?: reportsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * users.prescriptions
   */
  export type users$prescriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    where?: prescriptionsWhereInput
    orderBy?: prescriptionsOrderByWithRelationInput | prescriptionsOrderByWithRelationInput[]
    cursor?: prescriptionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PrescriptionsScalarFieldEnum | PrescriptionsScalarFieldEnum[]
  }

  /**
   * users.chat_history
   */
  export type users$chat_historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    where?: chat_historyWhereInput
    orderBy?: chat_historyOrderByWithRelationInput | chat_historyOrderByWithRelationInput[]
    cursor?: chat_historyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Chat_historyScalarFieldEnum | Chat_historyScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Model reports
   */

  export type AggregateReports = {
    _count: ReportsCountAggregateOutputType | null
    _min: ReportsMinAggregateOutputType | null
    _max: ReportsMaxAggregateOutputType | null
  }

  export type ReportsMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    file_url: string | null
    report_name: string | null
    summary: string | null
    created_at: Date | null
  }

  export type ReportsMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    file_url: string | null
    report_name: string | null
    summary: string | null
    created_at: Date | null
  }

  export type ReportsCountAggregateOutputType = {
    id: number
    user_id: number
    file_url: number
    report_name: number
    summary: number
    created_at: number
    _all: number
  }


  export type ReportsMinAggregateInputType = {
    id?: true
    user_id?: true
    file_url?: true
    report_name?: true
    summary?: true
    created_at?: true
  }

  export type ReportsMaxAggregateInputType = {
    id?: true
    user_id?: true
    file_url?: true
    report_name?: true
    summary?: true
    created_at?: true
  }

  export type ReportsCountAggregateInputType = {
    id?: true
    user_id?: true
    file_url?: true
    report_name?: true
    summary?: true
    created_at?: true
    _all?: true
  }

  export type ReportsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reports to aggregate.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned reports
    **/
    _count?: true | ReportsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportsMaxAggregateInputType
  }

  export type GetReportsAggregateType<T extends ReportsAggregateArgs> = {
        [P in keyof T & keyof AggregateReports]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReports[P]>
      : GetScalarType<T[P], AggregateReports[P]>
  }




  export type reportsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reportsWhereInput
    orderBy?: reportsOrderByWithAggregationInput | reportsOrderByWithAggregationInput[]
    by: ReportsScalarFieldEnum[] | ReportsScalarFieldEnum
    having?: reportsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportsCountAggregateInputType | true
    _min?: ReportsMinAggregateInputType
    _max?: ReportsMaxAggregateInputType
  }

  export type ReportsGroupByOutputType = {
    id: string
    user_id: string
    file_url: string
    report_name: string | null
    summary: string | null
    created_at: Date
    _count: ReportsCountAggregateOutputType | null
    _min: ReportsMinAggregateOutputType | null
    _max: ReportsMaxAggregateOutputType | null
  }

  type GetReportsGroupByPayload<T extends reportsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportsGroupByOutputType[P]>
            : GetScalarType<T[P], ReportsGroupByOutputType[P]>
        }
      >
    >


  export type reportsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    report_name?: boolean
    summary?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
    health_metrics?: boolean | reports$health_metricsArgs<ExtArgs>
    _count?: boolean | ReportsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reports"]>

  export type reportsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    report_name?: boolean
    summary?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reports"]>

  export type reportsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    report_name?: boolean
    summary?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reports"]>

  export type reportsSelectScalar = {
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    report_name?: boolean
    summary?: boolean
    created_at?: boolean
  }

  export type reportsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "file_url" | "report_name" | "summary" | "created_at", ExtArgs["result"]["reports"]>
  export type reportsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
    health_metrics?: boolean | reports$health_metricsArgs<ExtArgs>
    _count?: boolean | ReportsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type reportsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type reportsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $reportsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "reports"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
      health_metrics: Prisma.$health_metricsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      file_url: string
      report_name: string | null
      summary: string | null
      created_at: Date
    }, ExtArgs["result"]["reports"]>
    composites: {}
  }

  type reportsGetPayload<S extends boolean | null | undefined | reportsDefaultArgs> = $Result.GetResult<Prisma.$reportsPayload, S>

  type reportsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<reportsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportsCountAggregateInputType | true
    }

  export interface reportsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['reports'], meta: { name: 'reports' } }
    /**
     * Find zero or one Reports that matches the filter.
     * @param {reportsFindUniqueArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reportsFindUniqueArgs>(args: SelectSubset<T, reportsFindUniqueArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reports that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {reportsFindUniqueOrThrowArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reportsFindUniqueOrThrowArgs>(args: SelectSubset<T, reportsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsFindFirstArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reportsFindFirstArgs>(args?: SelectSubset<T, reportsFindFirstArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reports that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsFindFirstOrThrowArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reportsFindFirstOrThrowArgs>(args?: SelectSubset<T, reportsFindFirstOrThrowArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.reports.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.reports.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportsWithIdOnly = await prisma.reports.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends reportsFindManyArgs>(args?: SelectSubset<T, reportsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reports.
     * @param {reportsCreateArgs} args - Arguments to create a Reports.
     * @example
     * // Create one Reports
     * const Reports = await prisma.reports.create({
     *   data: {
     *     // ... data to create a Reports
     *   }
     * })
     * 
     */
    create<T extends reportsCreateArgs>(args: SelectSubset<T, reportsCreateArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {reportsCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const reports = await prisma.reports.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends reportsCreateManyArgs>(args?: SelectSubset<T, reportsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reports and returns the data saved in the database.
     * @param {reportsCreateManyAndReturnArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const reports = await prisma.reports.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reports and only return the `id`
     * const reportsWithIdOnly = await prisma.reports.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends reportsCreateManyAndReturnArgs>(args?: SelectSubset<T, reportsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reports.
     * @param {reportsDeleteArgs} args - Arguments to delete one Reports.
     * @example
     * // Delete one Reports
     * const Reports = await prisma.reports.delete({
     *   where: {
     *     // ... filter to delete one Reports
     *   }
     * })
     * 
     */
    delete<T extends reportsDeleteArgs>(args: SelectSubset<T, reportsDeleteArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reports.
     * @param {reportsUpdateArgs} args - Arguments to update one Reports.
     * @example
     * // Update one Reports
     * const reports = await prisma.reports.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends reportsUpdateArgs>(args: SelectSubset<T, reportsUpdateArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {reportsDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.reports.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends reportsDeleteManyArgs>(args?: SelectSubset<T, reportsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const reports = await prisma.reports.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends reportsUpdateManyArgs>(args: SelectSubset<T, reportsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports and returns the data updated in the database.
     * @param {reportsUpdateManyAndReturnArgs} args - Arguments to update many Reports.
     * @example
     * // Update many Reports
     * const reports = await prisma.reports.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reports and only return the `id`
     * const reportsWithIdOnly = await prisma.reports.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends reportsUpdateManyAndReturnArgs>(args: SelectSubset<T, reportsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reports.
     * @param {reportsUpsertArgs} args - Arguments to update or create a Reports.
     * @example
     * // Update or create a Reports
     * const reports = await prisma.reports.upsert({
     *   create: {
     *     // ... data to create a Reports
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reports we want to update
     *   }
     * })
     */
    upsert<T extends reportsUpsertArgs>(args: SelectSubset<T, reportsUpsertArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.reports.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends reportsCountArgs>(
      args?: Subset<T, reportsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportsAggregateArgs>(args: Subset<T, ReportsAggregateArgs>): Prisma.PrismaPromise<GetReportsAggregateType<T>>

    /**
     * Group by Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends reportsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: reportsGroupByArgs['orderBy'] }
        : { orderBy?: reportsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, reportsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the reports model
   */
  readonly fields: reportsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for reports.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__reportsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    health_metrics<T extends reports$health_metricsArgs<ExtArgs> = {}>(args?: Subset<T, reports$health_metricsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the reports model
   */
  interface reportsFieldRefs {
    readonly id: FieldRef<"reports", 'String'>
    readonly user_id: FieldRef<"reports", 'String'>
    readonly file_url: FieldRef<"reports", 'String'>
    readonly report_name: FieldRef<"reports", 'String'>
    readonly summary: FieldRef<"reports", 'String'>
    readonly created_at: FieldRef<"reports", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * reports findUnique
   */
  export type reportsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports findUniqueOrThrow
   */
  export type reportsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports findFirst
   */
  export type reportsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reports.
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reports.
     */
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * reports findFirstOrThrow
   */
  export type reportsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reports.
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reports.
     */
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * reports findMany
   */
  export type reportsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing reports.
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reports.
     */
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * reports create
   */
  export type reportsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * The data needed to create a reports.
     */
    data: XOR<reportsCreateInput, reportsUncheckedCreateInput>
  }

  /**
   * reports createMany
   */
  export type reportsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many reports.
     */
    data: reportsCreateManyInput | reportsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * reports createManyAndReturn
   */
  export type reportsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * The data used to create many reports.
     */
    data: reportsCreateManyInput | reportsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * reports update
   */
  export type reportsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * The data needed to update a reports.
     */
    data: XOR<reportsUpdateInput, reportsUncheckedUpdateInput>
    /**
     * Choose, which reports to update.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports updateMany
   */
  export type reportsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update reports.
     */
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyInput>
    /**
     * Filter which reports to update
     */
    where?: reportsWhereInput
    /**
     * Limit how many reports to update.
     */
    limit?: number
  }

  /**
   * reports updateManyAndReturn
   */
  export type reportsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * The data used to update reports.
     */
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyInput>
    /**
     * Filter which reports to update
     */
    where?: reportsWhereInput
    /**
     * Limit how many reports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * reports upsert
   */
  export type reportsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * The filter to search for the reports to update in case it exists.
     */
    where: reportsWhereUniqueInput
    /**
     * In case the reports found by the `where` argument doesn't exist, create a new reports with this data.
     */
    create: XOR<reportsCreateInput, reportsUncheckedCreateInput>
    /**
     * In case the reports was found with the provided `where` argument, update it with this data.
     */
    update: XOR<reportsUpdateInput, reportsUncheckedUpdateInput>
  }

  /**
   * reports delete
   */
  export type reportsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter which reports to delete.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports deleteMany
   */
  export type reportsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reports to delete
     */
    where?: reportsWhereInput
    /**
     * Limit how many reports to delete.
     */
    limit?: number
  }

  /**
   * reports.health_metrics
   */
  export type reports$health_metricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    where?: health_metricsWhereInput
    orderBy?: health_metricsOrderByWithRelationInput | health_metricsOrderByWithRelationInput[]
    cursor?: health_metricsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Health_metricsScalarFieldEnum | Health_metricsScalarFieldEnum[]
  }

  /**
   * reports without action
   */
  export type reportsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
  }


  /**
   * Model health_metrics
   */

  export type AggregateHealth_metrics = {
    _count: Health_metricsCountAggregateOutputType | null
    _min: Health_metricsMinAggregateOutputType | null
    _max: Health_metricsMaxAggregateOutputType | null
  }

  export type Health_metricsMinAggregateOutputType = {
    id: string | null
    report_id: string | null
    metric_name: string | null
    metric_value: string | null
    status: string | null
    explanation: string | null
    created_at: Date | null
  }

  export type Health_metricsMaxAggregateOutputType = {
    id: string | null
    report_id: string | null
    metric_name: string | null
    metric_value: string | null
    status: string | null
    explanation: string | null
    created_at: Date | null
  }

  export type Health_metricsCountAggregateOutputType = {
    id: number
    report_id: number
    metric_name: number
    metric_value: number
    status: number
    explanation: number
    created_at: number
    _all: number
  }


  export type Health_metricsMinAggregateInputType = {
    id?: true
    report_id?: true
    metric_name?: true
    metric_value?: true
    status?: true
    explanation?: true
    created_at?: true
  }

  export type Health_metricsMaxAggregateInputType = {
    id?: true
    report_id?: true
    metric_name?: true
    metric_value?: true
    status?: true
    explanation?: true
    created_at?: true
  }

  export type Health_metricsCountAggregateInputType = {
    id?: true
    report_id?: true
    metric_name?: true
    metric_value?: true
    status?: true
    explanation?: true
    created_at?: true
    _all?: true
  }

  export type Health_metricsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which health_metrics to aggregate.
     */
    where?: health_metricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of health_metrics to fetch.
     */
    orderBy?: health_metricsOrderByWithRelationInput | health_metricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: health_metricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` health_metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` health_metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned health_metrics
    **/
    _count?: true | Health_metricsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Health_metricsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Health_metricsMaxAggregateInputType
  }

  export type GetHealth_metricsAggregateType<T extends Health_metricsAggregateArgs> = {
        [P in keyof T & keyof AggregateHealth_metrics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHealth_metrics[P]>
      : GetScalarType<T[P], AggregateHealth_metrics[P]>
  }




  export type health_metricsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: health_metricsWhereInput
    orderBy?: health_metricsOrderByWithAggregationInput | health_metricsOrderByWithAggregationInput[]
    by: Health_metricsScalarFieldEnum[] | Health_metricsScalarFieldEnum
    having?: health_metricsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Health_metricsCountAggregateInputType | true
    _min?: Health_metricsMinAggregateInputType
    _max?: Health_metricsMaxAggregateInputType
  }

  export type Health_metricsGroupByOutputType = {
    id: string
    report_id: string
    metric_name: string | null
    metric_value: string | null
    status: string | null
    explanation: string | null
    created_at: Date
    _count: Health_metricsCountAggregateOutputType | null
    _min: Health_metricsMinAggregateOutputType | null
    _max: Health_metricsMaxAggregateOutputType | null
  }

  type GetHealth_metricsGroupByPayload<T extends health_metricsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Health_metricsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Health_metricsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Health_metricsGroupByOutputType[P]>
            : GetScalarType<T[P], Health_metricsGroupByOutputType[P]>
        }
      >
    >


  export type health_metricsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    report_id?: boolean
    metric_name?: boolean
    metric_value?: boolean
    status?: boolean
    explanation?: boolean
    created_at?: boolean
    report?: boolean | reportsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["health_metrics"]>

  export type health_metricsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    report_id?: boolean
    metric_name?: boolean
    metric_value?: boolean
    status?: boolean
    explanation?: boolean
    created_at?: boolean
    report?: boolean | reportsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["health_metrics"]>

  export type health_metricsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    report_id?: boolean
    metric_name?: boolean
    metric_value?: boolean
    status?: boolean
    explanation?: boolean
    created_at?: boolean
    report?: boolean | reportsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["health_metrics"]>

  export type health_metricsSelectScalar = {
    id?: boolean
    report_id?: boolean
    metric_name?: boolean
    metric_value?: boolean
    status?: boolean
    explanation?: boolean
    created_at?: boolean
  }

  export type health_metricsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "report_id" | "metric_name" | "metric_value" | "status" | "explanation" | "created_at", ExtArgs["result"]["health_metrics"]>
  export type health_metricsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | reportsDefaultArgs<ExtArgs>
  }
  export type health_metricsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | reportsDefaultArgs<ExtArgs>
  }
  export type health_metricsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | reportsDefaultArgs<ExtArgs>
  }

  export type $health_metricsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "health_metrics"
    objects: {
      report: Prisma.$reportsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      report_id: string
      metric_name: string | null
      metric_value: string | null
      status: string | null
      explanation: string | null
      created_at: Date
    }, ExtArgs["result"]["health_metrics"]>
    composites: {}
  }

  type health_metricsGetPayload<S extends boolean | null | undefined | health_metricsDefaultArgs> = $Result.GetResult<Prisma.$health_metricsPayload, S>

  type health_metricsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<health_metricsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Health_metricsCountAggregateInputType | true
    }

  export interface health_metricsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['health_metrics'], meta: { name: 'health_metrics' } }
    /**
     * Find zero or one Health_metrics that matches the filter.
     * @param {health_metricsFindUniqueArgs} args - Arguments to find a Health_metrics
     * @example
     * // Get one Health_metrics
     * const health_metrics = await prisma.health_metrics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends health_metricsFindUniqueArgs>(args: SelectSubset<T, health_metricsFindUniqueArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Health_metrics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {health_metricsFindUniqueOrThrowArgs} args - Arguments to find a Health_metrics
     * @example
     * // Get one Health_metrics
     * const health_metrics = await prisma.health_metrics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends health_metricsFindUniqueOrThrowArgs>(args: SelectSubset<T, health_metricsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Health_metrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {health_metricsFindFirstArgs} args - Arguments to find a Health_metrics
     * @example
     * // Get one Health_metrics
     * const health_metrics = await prisma.health_metrics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends health_metricsFindFirstArgs>(args?: SelectSubset<T, health_metricsFindFirstArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Health_metrics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {health_metricsFindFirstOrThrowArgs} args - Arguments to find a Health_metrics
     * @example
     * // Get one Health_metrics
     * const health_metrics = await prisma.health_metrics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends health_metricsFindFirstOrThrowArgs>(args?: SelectSubset<T, health_metricsFindFirstOrThrowArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Health_metrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {health_metricsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Health_metrics
     * const health_metrics = await prisma.health_metrics.findMany()
     * 
     * // Get first 10 Health_metrics
     * const health_metrics = await prisma.health_metrics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const health_metricsWithIdOnly = await prisma.health_metrics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends health_metricsFindManyArgs>(args?: SelectSubset<T, health_metricsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Health_metrics.
     * @param {health_metricsCreateArgs} args - Arguments to create a Health_metrics.
     * @example
     * // Create one Health_metrics
     * const Health_metrics = await prisma.health_metrics.create({
     *   data: {
     *     // ... data to create a Health_metrics
     *   }
     * })
     * 
     */
    create<T extends health_metricsCreateArgs>(args: SelectSubset<T, health_metricsCreateArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Health_metrics.
     * @param {health_metricsCreateManyArgs} args - Arguments to create many Health_metrics.
     * @example
     * // Create many Health_metrics
     * const health_metrics = await prisma.health_metrics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends health_metricsCreateManyArgs>(args?: SelectSubset<T, health_metricsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Health_metrics and returns the data saved in the database.
     * @param {health_metricsCreateManyAndReturnArgs} args - Arguments to create many Health_metrics.
     * @example
     * // Create many Health_metrics
     * const health_metrics = await prisma.health_metrics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Health_metrics and only return the `id`
     * const health_metricsWithIdOnly = await prisma.health_metrics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends health_metricsCreateManyAndReturnArgs>(args?: SelectSubset<T, health_metricsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Health_metrics.
     * @param {health_metricsDeleteArgs} args - Arguments to delete one Health_metrics.
     * @example
     * // Delete one Health_metrics
     * const Health_metrics = await prisma.health_metrics.delete({
     *   where: {
     *     // ... filter to delete one Health_metrics
     *   }
     * })
     * 
     */
    delete<T extends health_metricsDeleteArgs>(args: SelectSubset<T, health_metricsDeleteArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Health_metrics.
     * @param {health_metricsUpdateArgs} args - Arguments to update one Health_metrics.
     * @example
     * // Update one Health_metrics
     * const health_metrics = await prisma.health_metrics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends health_metricsUpdateArgs>(args: SelectSubset<T, health_metricsUpdateArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Health_metrics.
     * @param {health_metricsDeleteManyArgs} args - Arguments to filter Health_metrics to delete.
     * @example
     * // Delete a few Health_metrics
     * const { count } = await prisma.health_metrics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends health_metricsDeleteManyArgs>(args?: SelectSubset<T, health_metricsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Health_metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {health_metricsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Health_metrics
     * const health_metrics = await prisma.health_metrics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends health_metricsUpdateManyArgs>(args: SelectSubset<T, health_metricsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Health_metrics and returns the data updated in the database.
     * @param {health_metricsUpdateManyAndReturnArgs} args - Arguments to update many Health_metrics.
     * @example
     * // Update many Health_metrics
     * const health_metrics = await prisma.health_metrics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Health_metrics and only return the `id`
     * const health_metricsWithIdOnly = await prisma.health_metrics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends health_metricsUpdateManyAndReturnArgs>(args: SelectSubset<T, health_metricsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Health_metrics.
     * @param {health_metricsUpsertArgs} args - Arguments to update or create a Health_metrics.
     * @example
     * // Update or create a Health_metrics
     * const health_metrics = await prisma.health_metrics.upsert({
     *   create: {
     *     // ... data to create a Health_metrics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Health_metrics we want to update
     *   }
     * })
     */
    upsert<T extends health_metricsUpsertArgs>(args: SelectSubset<T, health_metricsUpsertArgs<ExtArgs>>): Prisma__health_metricsClient<$Result.GetResult<Prisma.$health_metricsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Health_metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {health_metricsCountArgs} args - Arguments to filter Health_metrics to count.
     * @example
     * // Count the number of Health_metrics
     * const count = await prisma.health_metrics.count({
     *   where: {
     *     // ... the filter for the Health_metrics we want to count
     *   }
     * })
    **/
    count<T extends health_metricsCountArgs>(
      args?: Subset<T, health_metricsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Health_metricsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Health_metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Health_metricsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Health_metricsAggregateArgs>(args: Subset<T, Health_metricsAggregateArgs>): Prisma.PrismaPromise<GetHealth_metricsAggregateType<T>>

    /**
     * Group by Health_metrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {health_metricsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends health_metricsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: health_metricsGroupByArgs['orderBy'] }
        : { orderBy?: health_metricsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, health_metricsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHealth_metricsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the health_metrics model
   */
  readonly fields: health_metricsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for health_metrics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__health_metricsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    report<T extends reportsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, reportsDefaultArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the health_metrics model
   */
  interface health_metricsFieldRefs {
    readonly id: FieldRef<"health_metrics", 'String'>
    readonly report_id: FieldRef<"health_metrics", 'String'>
    readonly metric_name: FieldRef<"health_metrics", 'String'>
    readonly metric_value: FieldRef<"health_metrics", 'String'>
    readonly status: FieldRef<"health_metrics", 'String'>
    readonly explanation: FieldRef<"health_metrics", 'String'>
    readonly created_at: FieldRef<"health_metrics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * health_metrics findUnique
   */
  export type health_metricsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * Filter, which health_metrics to fetch.
     */
    where: health_metricsWhereUniqueInput
  }

  /**
   * health_metrics findUniqueOrThrow
   */
  export type health_metricsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * Filter, which health_metrics to fetch.
     */
    where: health_metricsWhereUniqueInput
  }

  /**
   * health_metrics findFirst
   */
  export type health_metricsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * Filter, which health_metrics to fetch.
     */
    where?: health_metricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of health_metrics to fetch.
     */
    orderBy?: health_metricsOrderByWithRelationInput | health_metricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for health_metrics.
     */
    cursor?: health_metricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` health_metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` health_metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of health_metrics.
     */
    distinct?: Health_metricsScalarFieldEnum | Health_metricsScalarFieldEnum[]
  }

  /**
   * health_metrics findFirstOrThrow
   */
  export type health_metricsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * Filter, which health_metrics to fetch.
     */
    where?: health_metricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of health_metrics to fetch.
     */
    orderBy?: health_metricsOrderByWithRelationInput | health_metricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for health_metrics.
     */
    cursor?: health_metricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` health_metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` health_metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of health_metrics.
     */
    distinct?: Health_metricsScalarFieldEnum | Health_metricsScalarFieldEnum[]
  }

  /**
   * health_metrics findMany
   */
  export type health_metricsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * Filter, which health_metrics to fetch.
     */
    where?: health_metricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of health_metrics to fetch.
     */
    orderBy?: health_metricsOrderByWithRelationInput | health_metricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing health_metrics.
     */
    cursor?: health_metricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` health_metrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` health_metrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of health_metrics.
     */
    distinct?: Health_metricsScalarFieldEnum | Health_metricsScalarFieldEnum[]
  }

  /**
   * health_metrics create
   */
  export type health_metricsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * The data needed to create a health_metrics.
     */
    data: XOR<health_metricsCreateInput, health_metricsUncheckedCreateInput>
  }

  /**
   * health_metrics createMany
   */
  export type health_metricsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many health_metrics.
     */
    data: health_metricsCreateManyInput | health_metricsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * health_metrics createManyAndReturn
   */
  export type health_metricsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * The data used to create many health_metrics.
     */
    data: health_metricsCreateManyInput | health_metricsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * health_metrics update
   */
  export type health_metricsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * The data needed to update a health_metrics.
     */
    data: XOR<health_metricsUpdateInput, health_metricsUncheckedUpdateInput>
    /**
     * Choose, which health_metrics to update.
     */
    where: health_metricsWhereUniqueInput
  }

  /**
   * health_metrics updateMany
   */
  export type health_metricsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update health_metrics.
     */
    data: XOR<health_metricsUpdateManyMutationInput, health_metricsUncheckedUpdateManyInput>
    /**
     * Filter which health_metrics to update
     */
    where?: health_metricsWhereInput
    /**
     * Limit how many health_metrics to update.
     */
    limit?: number
  }

  /**
   * health_metrics updateManyAndReturn
   */
  export type health_metricsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * The data used to update health_metrics.
     */
    data: XOR<health_metricsUpdateManyMutationInput, health_metricsUncheckedUpdateManyInput>
    /**
     * Filter which health_metrics to update
     */
    where?: health_metricsWhereInput
    /**
     * Limit how many health_metrics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * health_metrics upsert
   */
  export type health_metricsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * The filter to search for the health_metrics to update in case it exists.
     */
    where: health_metricsWhereUniqueInput
    /**
     * In case the health_metrics found by the `where` argument doesn't exist, create a new health_metrics with this data.
     */
    create: XOR<health_metricsCreateInput, health_metricsUncheckedCreateInput>
    /**
     * In case the health_metrics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<health_metricsUpdateInput, health_metricsUncheckedUpdateInput>
  }

  /**
   * health_metrics delete
   */
  export type health_metricsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
    /**
     * Filter which health_metrics to delete.
     */
    where: health_metricsWhereUniqueInput
  }

  /**
   * health_metrics deleteMany
   */
  export type health_metricsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which health_metrics to delete
     */
    where?: health_metricsWhereInput
    /**
     * Limit how many health_metrics to delete.
     */
    limit?: number
  }

  /**
   * health_metrics without action
   */
  export type health_metricsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the health_metrics
     */
    select?: health_metricsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the health_metrics
     */
    omit?: health_metricsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: health_metricsInclude<ExtArgs> | null
  }


  /**
   * Model prescriptions
   */

  export type AggregatePrescriptions = {
    _count: PrescriptionsCountAggregateOutputType | null
    _min: PrescriptionsMinAggregateOutputType | null
    _max: PrescriptionsMaxAggregateOutputType | null
  }

  export type PrescriptionsMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    file_url: string | null
    extracted_text: string | null
    created_at: Date | null
  }

  export type PrescriptionsMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    file_url: string | null
    extracted_text: string | null
    created_at: Date | null
  }

  export type PrescriptionsCountAggregateOutputType = {
    id: number
    user_id: number
    file_url: number
    extracted_text: number
    created_at: number
    _all: number
  }


  export type PrescriptionsMinAggregateInputType = {
    id?: true
    user_id?: true
    file_url?: true
    extracted_text?: true
    created_at?: true
  }

  export type PrescriptionsMaxAggregateInputType = {
    id?: true
    user_id?: true
    file_url?: true
    extracted_text?: true
    created_at?: true
  }

  export type PrescriptionsCountAggregateInputType = {
    id?: true
    user_id?: true
    file_url?: true
    extracted_text?: true
    created_at?: true
    _all?: true
  }

  export type PrescriptionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which prescriptions to aggregate.
     */
    where?: prescriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of prescriptions to fetch.
     */
    orderBy?: prescriptionsOrderByWithRelationInput | prescriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: prescriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned prescriptions
    **/
    _count?: true | PrescriptionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrescriptionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrescriptionsMaxAggregateInputType
  }

  export type GetPrescriptionsAggregateType<T extends PrescriptionsAggregateArgs> = {
        [P in keyof T & keyof AggregatePrescriptions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrescriptions[P]>
      : GetScalarType<T[P], AggregatePrescriptions[P]>
  }




  export type prescriptionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: prescriptionsWhereInput
    orderBy?: prescriptionsOrderByWithAggregationInput | prescriptionsOrderByWithAggregationInput[]
    by: PrescriptionsScalarFieldEnum[] | PrescriptionsScalarFieldEnum
    having?: prescriptionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrescriptionsCountAggregateInputType | true
    _min?: PrescriptionsMinAggregateInputType
    _max?: PrescriptionsMaxAggregateInputType
  }

  export type PrescriptionsGroupByOutputType = {
    id: string
    user_id: string
    file_url: string
    extracted_text: string | null
    created_at: Date
    _count: PrescriptionsCountAggregateOutputType | null
    _min: PrescriptionsMinAggregateOutputType | null
    _max: PrescriptionsMaxAggregateOutputType | null
  }

  type GetPrescriptionsGroupByPayload<T extends prescriptionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrescriptionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrescriptionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrescriptionsGroupByOutputType[P]>
            : GetScalarType<T[P], PrescriptionsGroupByOutputType[P]>
        }
      >
    >


  export type prescriptionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    extracted_text?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
    medicines?: boolean | prescriptions$medicinesArgs<ExtArgs>
    _count?: boolean | PrescriptionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prescriptions"]>

  export type prescriptionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    extracted_text?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prescriptions"]>

  export type prescriptionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    extracted_text?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prescriptions"]>

  export type prescriptionsSelectScalar = {
    id?: boolean
    user_id?: boolean
    file_url?: boolean
    extracted_text?: boolean
    created_at?: boolean
  }

  export type prescriptionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "file_url" | "extracted_text" | "created_at", ExtArgs["result"]["prescriptions"]>
  export type prescriptionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
    medicines?: boolean | prescriptions$medicinesArgs<ExtArgs>
    _count?: boolean | PrescriptionsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type prescriptionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type prescriptionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $prescriptionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "prescriptions"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
      medicines: Prisma.$medicinesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      file_url: string
      extracted_text: string | null
      created_at: Date
    }, ExtArgs["result"]["prescriptions"]>
    composites: {}
  }

  type prescriptionsGetPayload<S extends boolean | null | undefined | prescriptionsDefaultArgs> = $Result.GetResult<Prisma.$prescriptionsPayload, S>

  type prescriptionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<prescriptionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrescriptionsCountAggregateInputType | true
    }

  export interface prescriptionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['prescriptions'], meta: { name: 'prescriptions' } }
    /**
     * Find zero or one Prescriptions that matches the filter.
     * @param {prescriptionsFindUniqueArgs} args - Arguments to find a Prescriptions
     * @example
     * // Get one Prescriptions
     * const prescriptions = await prisma.prescriptions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends prescriptionsFindUniqueArgs>(args: SelectSubset<T, prescriptionsFindUniqueArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Prescriptions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {prescriptionsFindUniqueOrThrowArgs} args - Arguments to find a Prescriptions
     * @example
     * // Get one Prescriptions
     * const prescriptions = await prisma.prescriptions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends prescriptionsFindUniqueOrThrowArgs>(args: SelectSubset<T, prescriptionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Prescriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {prescriptionsFindFirstArgs} args - Arguments to find a Prescriptions
     * @example
     * // Get one Prescriptions
     * const prescriptions = await prisma.prescriptions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends prescriptionsFindFirstArgs>(args?: SelectSubset<T, prescriptionsFindFirstArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Prescriptions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {prescriptionsFindFirstOrThrowArgs} args - Arguments to find a Prescriptions
     * @example
     * // Get one Prescriptions
     * const prescriptions = await prisma.prescriptions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends prescriptionsFindFirstOrThrowArgs>(args?: SelectSubset<T, prescriptionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Prescriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {prescriptionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Prescriptions
     * const prescriptions = await prisma.prescriptions.findMany()
     * 
     * // Get first 10 Prescriptions
     * const prescriptions = await prisma.prescriptions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const prescriptionsWithIdOnly = await prisma.prescriptions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends prescriptionsFindManyArgs>(args?: SelectSubset<T, prescriptionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Prescriptions.
     * @param {prescriptionsCreateArgs} args - Arguments to create a Prescriptions.
     * @example
     * // Create one Prescriptions
     * const Prescriptions = await prisma.prescriptions.create({
     *   data: {
     *     // ... data to create a Prescriptions
     *   }
     * })
     * 
     */
    create<T extends prescriptionsCreateArgs>(args: SelectSubset<T, prescriptionsCreateArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Prescriptions.
     * @param {prescriptionsCreateManyArgs} args - Arguments to create many Prescriptions.
     * @example
     * // Create many Prescriptions
     * const prescriptions = await prisma.prescriptions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends prescriptionsCreateManyArgs>(args?: SelectSubset<T, prescriptionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Prescriptions and returns the data saved in the database.
     * @param {prescriptionsCreateManyAndReturnArgs} args - Arguments to create many Prescriptions.
     * @example
     * // Create many Prescriptions
     * const prescriptions = await prisma.prescriptions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Prescriptions and only return the `id`
     * const prescriptionsWithIdOnly = await prisma.prescriptions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends prescriptionsCreateManyAndReturnArgs>(args?: SelectSubset<T, prescriptionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Prescriptions.
     * @param {prescriptionsDeleteArgs} args - Arguments to delete one Prescriptions.
     * @example
     * // Delete one Prescriptions
     * const Prescriptions = await prisma.prescriptions.delete({
     *   where: {
     *     // ... filter to delete one Prescriptions
     *   }
     * })
     * 
     */
    delete<T extends prescriptionsDeleteArgs>(args: SelectSubset<T, prescriptionsDeleteArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Prescriptions.
     * @param {prescriptionsUpdateArgs} args - Arguments to update one Prescriptions.
     * @example
     * // Update one Prescriptions
     * const prescriptions = await prisma.prescriptions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends prescriptionsUpdateArgs>(args: SelectSubset<T, prescriptionsUpdateArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Prescriptions.
     * @param {prescriptionsDeleteManyArgs} args - Arguments to filter Prescriptions to delete.
     * @example
     * // Delete a few Prescriptions
     * const { count } = await prisma.prescriptions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends prescriptionsDeleteManyArgs>(args?: SelectSubset<T, prescriptionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Prescriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {prescriptionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Prescriptions
     * const prescriptions = await prisma.prescriptions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends prescriptionsUpdateManyArgs>(args: SelectSubset<T, prescriptionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Prescriptions and returns the data updated in the database.
     * @param {prescriptionsUpdateManyAndReturnArgs} args - Arguments to update many Prescriptions.
     * @example
     * // Update many Prescriptions
     * const prescriptions = await prisma.prescriptions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Prescriptions and only return the `id`
     * const prescriptionsWithIdOnly = await prisma.prescriptions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends prescriptionsUpdateManyAndReturnArgs>(args: SelectSubset<T, prescriptionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Prescriptions.
     * @param {prescriptionsUpsertArgs} args - Arguments to update or create a Prescriptions.
     * @example
     * // Update or create a Prescriptions
     * const prescriptions = await prisma.prescriptions.upsert({
     *   create: {
     *     // ... data to create a Prescriptions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Prescriptions we want to update
     *   }
     * })
     */
    upsert<T extends prescriptionsUpsertArgs>(args: SelectSubset<T, prescriptionsUpsertArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Prescriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {prescriptionsCountArgs} args - Arguments to filter Prescriptions to count.
     * @example
     * // Count the number of Prescriptions
     * const count = await prisma.prescriptions.count({
     *   where: {
     *     // ... the filter for the Prescriptions we want to count
     *   }
     * })
    **/
    count<T extends prescriptionsCountArgs>(
      args?: Subset<T, prescriptionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrescriptionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Prescriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrescriptionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrescriptionsAggregateArgs>(args: Subset<T, PrescriptionsAggregateArgs>): Prisma.PrismaPromise<GetPrescriptionsAggregateType<T>>

    /**
     * Group by Prescriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {prescriptionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends prescriptionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: prescriptionsGroupByArgs['orderBy'] }
        : { orderBy?: prescriptionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, prescriptionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrescriptionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the prescriptions model
   */
  readonly fields: prescriptionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for prescriptions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__prescriptionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    medicines<T extends prescriptions$medicinesArgs<ExtArgs> = {}>(args?: Subset<T, prescriptions$medicinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the prescriptions model
   */
  interface prescriptionsFieldRefs {
    readonly id: FieldRef<"prescriptions", 'String'>
    readonly user_id: FieldRef<"prescriptions", 'String'>
    readonly file_url: FieldRef<"prescriptions", 'String'>
    readonly extracted_text: FieldRef<"prescriptions", 'String'>
    readonly created_at: FieldRef<"prescriptions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * prescriptions findUnique
   */
  export type prescriptionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * Filter, which prescriptions to fetch.
     */
    where: prescriptionsWhereUniqueInput
  }

  /**
   * prescriptions findUniqueOrThrow
   */
  export type prescriptionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * Filter, which prescriptions to fetch.
     */
    where: prescriptionsWhereUniqueInput
  }

  /**
   * prescriptions findFirst
   */
  export type prescriptionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * Filter, which prescriptions to fetch.
     */
    where?: prescriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of prescriptions to fetch.
     */
    orderBy?: prescriptionsOrderByWithRelationInput | prescriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for prescriptions.
     */
    cursor?: prescriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of prescriptions.
     */
    distinct?: PrescriptionsScalarFieldEnum | PrescriptionsScalarFieldEnum[]
  }

  /**
   * prescriptions findFirstOrThrow
   */
  export type prescriptionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * Filter, which prescriptions to fetch.
     */
    where?: prescriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of prescriptions to fetch.
     */
    orderBy?: prescriptionsOrderByWithRelationInput | prescriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for prescriptions.
     */
    cursor?: prescriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of prescriptions.
     */
    distinct?: PrescriptionsScalarFieldEnum | PrescriptionsScalarFieldEnum[]
  }

  /**
   * prescriptions findMany
   */
  export type prescriptionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * Filter, which prescriptions to fetch.
     */
    where?: prescriptionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of prescriptions to fetch.
     */
    orderBy?: prescriptionsOrderByWithRelationInput | prescriptionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing prescriptions.
     */
    cursor?: prescriptionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` prescriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` prescriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of prescriptions.
     */
    distinct?: PrescriptionsScalarFieldEnum | PrescriptionsScalarFieldEnum[]
  }

  /**
   * prescriptions create
   */
  export type prescriptionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * The data needed to create a prescriptions.
     */
    data: XOR<prescriptionsCreateInput, prescriptionsUncheckedCreateInput>
  }

  /**
   * prescriptions createMany
   */
  export type prescriptionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many prescriptions.
     */
    data: prescriptionsCreateManyInput | prescriptionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * prescriptions createManyAndReturn
   */
  export type prescriptionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * The data used to create many prescriptions.
     */
    data: prescriptionsCreateManyInput | prescriptionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * prescriptions update
   */
  export type prescriptionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * The data needed to update a prescriptions.
     */
    data: XOR<prescriptionsUpdateInput, prescriptionsUncheckedUpdateInput>
    /**
     * Choose, which prescriptions to update.
     */
    where: prescriptionsWhereUniqueInput
  }

  /**
   * prescriptions updateMany
   */
  export type prescriptionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update prescriptions.
     */
    data: XOR<prescriptionsUpdateManyMutationInput, prescriptionsUncheckedUpdateManyInput>
    /**
     * Filter which prescriptions to update
     */
    where?: prescriptionsWhereInput
    /**
     * Limit how many prescriptions to update.
     */
    limit?: number
  }

  /**
   * prescriptions updateManyAndReturn
   */
  export type prescriptionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * The data used to update prescriptions.
     */
    data: XOR<prescriptionsUpdateManyMutationInput, prescriptionsUncheckedUpdateManyInput>
    /**
     * Filter which prescriptions to update
     */
    where?: prescriptionsWhereInput
    /**
     * Limit how many prescriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * prescriptions upsert
   */
  export type prescriptionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * The filter to search for the prescriptions to update in case it exists.
     */
    where: prescriptionsWhereUniqueInput
    /**
     * In case the prescriptions found by the `where` argument doesn't exist, create a new prescriptions with this data.
     */
    create: XOR<prescriptionsCreateInput, prescriptionsUncheckedCreateInput>
    /**
     * In case the prescriptions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<prescriptionsUpdateInput, prescriptionsUncheckedUpdateInput>
  }

  /**
   * prescriptions delete
   */
  export type prescriptionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
    /**
     * Filter which prescriptions to delete.
     */
    where: prescriptionsWhereUniqueInput
  }

  /**
   * prescriptions deleteMany
   */
  export type prescriptionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which prescriptions to delete
     */
    where?: prescriptionsWhereInput
    /**
     * Limit how many prescriptions to delete.
     */
    limit?: number
  }

  /**
   * prescriptions.medicines
   */
  export type prescriptions$medicinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    where?: medicinesWhereInput
    orderBy?: medicinesOrderByWithRelationInput | medicinesOrderByWithRelationInput[]
    cursor?: medicinesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MedicinesScalarFieldEnum | MedicinesScalarFieldEnum[]
  }

  /**
   * prescriptions without action
   */
  export type prescriptionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the prescriptions
     */
    select?: prescriptionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the prescriptions
     */
    omit?: prescriptionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: prescriptionsInclude<ExtArgs> | null
  }


  /**
   * Model medicines
   */

  export type AggregateMedicines = {
    _count: MedicinesCountAggregateOutputType | null
    _min: MedicinesMinAggregateOutputType | null
    _max: MedicinesMaxAggregateOutputType | null
  }

  export type MedicinesMinAggregateOutputType = {
    id: string | null
    prescription_id: string | null
    medicine_name: string | null
    usage_info: string | null
    dosage_info: string | null
    side_effects: string | null
  }

  export type MedicinesMaxAggregateOutputType = {
    id: string | null
    prescription_id: string | null
    medicine_name: string | null
    usage_info: string | null
    dosage_info: string | null
    side_effects: string | null
  }

  export type MedicinesCountAggregateOutputType = {
    id: number
    prescription_id: number
    medicine_name: number
    usage_info: number
    dosage_info: number
    side_effects: number
    _all: number
  }


  export type MedicinesMinAggregateInputType = {
    id?: true
    prescription_id?: true
    medicine_name?: true
    usage_info?: true
    dosage_info?: true
    side_effects?: true
  }

  export type MedicinesMaxAggregateInputType = {
    id?: true
    prescription_id?: true
    medicine_name?: true
    usage_info?: true
    dosage_info?: true
    side_effects?: true
  }

  export type MedicinesCountAggregateInputType = {
    id?: true
    prescription_id?: true
    medicine_name?: true
    usage_info?: true
    dosage_info?: true
    side_effects?: true
    _all?: true
  }

  export type MedicinesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which medicines to aggregate.
     */
    where?: medicinesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of medicines to fetch.
     */
    orderBy?: medicinesOrderByWithRelationInput | medicinesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: medicinesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` medicines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` medicines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned medicines
    **/
    _count?: true | MedicinesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MedicinesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MedicinesMaxAggregateInputType
  }

  export type GetMedicinesAggregateType<T extends MedicinesAggregateArgs> = {
        [P in keyof T & keyof AggregateMedicines]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedicines[P]>
      : GetScalarType<T[P], AggregateMedicines[P]>
  }




  export type medicinesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: medicinesWhereInput
    orderBy?: medicinesOrderByWithAggregationInput | medicinesOrderByWithAggregationInput[]
    by: MedicinesScalarFieldEnum[] | MedicinesScalarFieldEnum
    having?: medicinesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MedicinesCountAggregateInputType | true
    _min?: MedicinesMinAggregateInputType
    _max?: MedicinesMaxAggregateInputType
  }

  export type MedicinesGroupByOutputType = {
    id: string
    prescription_id: string
    medicine_name: string | null
    usage_info: string | null
    dosage_info: string | null
    side_effects: string | null
    _count: MedicinesCountAggregateOutputType | null
    _min: MedicinesMinAggregateOutputType | null
    _max: MedicinesMaxAggregateOutputType | null
  }

  type GetMedicinesGroupByPayload<T extends medicinesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MedicinesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MedicinesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MedicinesGroupByOutputType[P]>
            : GetScalarType<T[P], MedicinesGroupByOutputType[P]>
        }
      >
    >


  export type medicinesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescription_id?: boolean
    medicine_name?: boolean
    usage_info?: boolean
    dosage_info?: boolean
    side_effects?: boolean
    prescription?: boolean | prescriptionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["medicines"]>

  export type medicinesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescription_id?: boolean
    medicine_name?: boolean
    usage_info?: boolean
    dosage_info?: boolean
    side_effects?: boolean
    prescription?: boolean | prescriptionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["medicines"]>

  export type medicinesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prescription_id?: boolean
    medicine_name?: boolean
    usage_info?: boolean
    dosage_info?: boolean
    side_effects?: boolean
    prescription?: boolean | prescriptionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["medicines"]>

  export type medicinesSelectScalar = {
    id?: boolean
    prescription_id?: boolean
    medicine_name?: boolean
    usage_info?: boolean
    dosage_info?: boolean
    side_effects?: boolean
  }

  export type medicinesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "prescription_id" | "medicine_name" | "usage_info" | "dosage_info" | "side_effects", ExtArgs["result"]["medicines"]>
  export type medicinesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prescription?: boolean | prescriptionsDefaultArgs<ExtArgs>
  }
  export type medicinesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prescription?: boolean | prescriptionsDefaultArgs<ExtArgs>
  }
  export type medicinesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prescription?: boolean | prescriptionsDefaultArgs<ExtArgs>
  }

  export type $medicinesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "medicines"
    objects: {
      prescription: Prisma.$prescriptionsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prescription_id: string
      medicine_name: string | null
      usage_info: string | null
      dosage_info: string | null
      side_effects: string | null
    }, ExtArgs["result"]["medicines"]>
    composites: {}
  }

  type medicinesGetPayload<S extends boolean | null | undefined | medicinesDefaultArgs> = $Result.GetResult<Prisma.$medicinesPayload, S>

  type medicinesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<medicinesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MedicinesCountAggregateInputType | true
    }

  export interface medicinesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['medicines'], meta: { name: 'medicines' } }
    /**
     * Find zero or one Medicines that matches the filter.
     * @param {medicinesFindUniqueArgs} args - Arguments to find a Medicines
     * @example
     * // Get one Medicines
     * const medicines = await prisma.medicines.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends medicinesFindUniqueArgs>(args: SelectSubset<T, medicinesFindUniqueArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Medicines that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {medicinesFindUniqueOrThrowArgs} args - Arguments to find a Medicines
     * @example
     * // Get one Medicines
     * const medicines = await prisma.medicines.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends medicinesFindUniqueOrThrowArgs>(args: SelectSubset<T, medicinesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Medicines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {medicinesFindFirstArgs} args - Arguments to find a Medicines
     * @example
     * // Get one Medicines
     * const medicines = await prisma.medicines.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends medicinesFindFirstArgs>(args?: SelectSubset<T, medicinesFindFirstArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Medicines that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {medicinesFindFirstOrThrowArgs} args - Arguments to find a Medicines
     * @example
     * // Get one Medicines
     * const medicines = await prisma.medicines.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends medicinesFindFirstOrThrowArgs>(args?: SelectSubset<T, medicinesFindFirstOrThrowArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Medicines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {medicinesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Medicines
     * const medicines = await prisma.medicines.findMany()
     * 
     * // Get first 10 Medicines
     * const medicines = await prisma.medicines.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const medicinesWithIdOnly = await prisma.medicines.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends medicinesFindManyArgs>(args?: SelectSubset<T, medicinesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Medicines.
     * @param {medicinesCreateArgs} args - Arguments to create a Medicines.
     * @example
     * // Create one Medicines
     * const Medicines = await prisma.medicines.create({
     *   data: {
     *     // ... data to create a Medicines
     *   }
     * })
     * 
     */
    create<T extends medicinesCreateArgs>(args: SelectSubset<T, medicinesCreateArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Medicines.
     * @param {medicinesCreateManyArgs} args - Arguments to create many Medicines.
     * @example
     * // Create many Medicines
     * const medicines = await prisma.medicines.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends medicinesCreateManyArgs>(args?: SelectSubset<T, medicinesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Medicines and returns the data saved in the database.
     * @param {medicinesCreateManyAndReturnArgs} args - Arguments to create many Medicines.
     * @example
     * // Create many Medicines
     * const medicines = await prisma.medicines.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Medicines and only return the `id`
     * const medicinesWithIdOnly = await prisma.medicines.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends medicinesCreateManyAndReturnArgs>(args?: SelectSubset<T, medicinesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Medicines.
     * @param {medicinesDeleteArgs} args - Arguments to delete one Medicines.
     * @example
     * // Delete one Medicines
     * const Medicines = await prisma.medicines.delete({
     *   where: {
     *     // ... filter to delete one Medicines
     *   }
     * })
     * 
     */
    delete<T extends medicinesDeleteArgs>(args: SelectSubset<T, medicinesDeleteArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Medicines.
     * @param {medicinesUpdateArgs} args - Arguments to update one Medicines.
     * @example
     * // Update one Medicines
     * const medicines = await prisma.medicines.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends medicinesUpdateArgs>(args: SelectSubset<T, medicinesUpdateArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Medicines.
     * @param {medicinesDeleteManyArgs} args - Arguments to filter Medicines to delete.
     * @example
     * // Delete a few Medicines
     * const { count } = await prisma.medicines.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends medicinesDeleteManyArgs>(args?: SelectSubset<T, medicinesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Medicines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {medicinesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Medicines
     * const medicines = await prisma.medicines.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends medicinesUpdateManyArgs>(args: SelectSubset<T, medicinesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Medicines and returns the data updated in the database.
     * @param {medicinesUpdateManyAndReturnArgs} args - Arguments to update many Medicines.
     * @example
     * // Update many Medicines
     * const medicines = await prisma.medicines.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Medicines and only return the `id`
     * const medicinesWithIdOnly = await prisma.medicines.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends medicinesUpdateManyAndReturnArgs>(args: SelectSubset<T, medicinesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Medicines.
     * @param {medicinesUpsertArgs} args - Arguments to update or create a Medicines.
     * @example
     * // Update or create a Medicines
     * const medicines = await prisma.medicines.upsert({
     *   create: {
     *     // ... data to create a Medicines
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Medicines we want to update
     *   }
     * })
     */
    upsert<T extends medicinesUpsertArgs>(args: SelectSubset<T, medicinesUpsertArgs<ExtArgs>>): Prisma__medicinesClient<$Result.GetResult<Prisma.$medicinesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Medicines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {medicinesCountArgs} args - Arguments to filter Medicines to count.
     * @example
     * // Count the number of Medicines
     * const count = await prisma.medicines.count({
     *   where: {
     *     // ... the filter for the Medicines we want to count
     *   }
     * })
    **/
    count<T extends medicinesCountArgs>(
      args?: Subset<T, medicinesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MedicinesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Medicines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicinesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MedicinesAggregateArgs>(args: Subset<T, MedicinesAggregateArgs>): Prisma.PrismaPromise<GetMedicinesAggregateType<T>>

    /**
     * Group by Medicines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {medicinesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends medicinesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: medicinesGroupByArgs['orderBy'] }
        : { orderBy?: medicinesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, medicinesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMedicinesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the medicines model
   */
  readonly fields: medicinesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for medicines.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__medicinesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prescription<T extends prescriptionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, prescriptionsDefaultArgs<ExtArgs>>): Prisma__prescriptionsClient<$Result.GetResult<Prisma.$prescriptionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the medicines model
   */
  interface medicinesFieldRefs {
    readonly id: FieldRef<"medicines", 'String'>
    readonly prescription_id: FieldRef<"medicines", 'String'>
    readonly medicine_name: FieldRef<"medicines", 'String'>
    readonly usage_info: FieldRef<"medicines", 'String'>
    readonly dosage_info: FieldRef<"medicines", 'String'>
    readonly side_effects: FieldRef<"medicines", 'String'>
  }
    

  // Custom InputTypes
  /**
   * medicines findUnique
   */
  export type medicinesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * Filter, which medicines to fetch.
     */
    where: medicinesWhereUniqueInput
  }

  /**
   * medicines findUniqueOrThrow
   */
  export type medicinesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * Filter, which medicines to fetch.
     */
    where: medicinesWhereUniqueInput
  }

  /**
   * medicines findFirst
   */
  export type medicinesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * Filter, which medicines to fetch.
     */
    where?: medicinesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of medicines to fetch.
     */
    orderBy?: medicinesOrderByWithRelationInput | medicinesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for medicines.
     */
    cursor?: medicinesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` medicines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` medicines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of medicines.
     */
    distinct?: MedicinesScalarFieldEnum | MedicinesScalarFieldEnum[]
  }

  /**
   * medicines findFirstOrThrow
   */
  export type medicinesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * Filter, which medicines to fetch.
     */
    where?: medicinesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of medicines to fetch.
     */
    orderBy?: medicinesOrderByWithRelationInput | medicinesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for medicines.
     */
    cursor?: medicinesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` medicines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` medicines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of medicines.
     */
    distinct?: MedicinesScalarFieldEnum | MedicinesScalarFieldEnum[]
  }

  /**
   * medicines findMany
   */
  export type medicinesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * Filter, which medicines to fetch.
     */
    where?: medicinesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of medicines to fetch.
     */
    orderBy?: medicinesOrderByWithRelationInput | medicinesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing medicines.
     */
    cursor?: medicinesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` medicines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` medicines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of medicines.
     */
    distinct?: MedicinesScalarFieldEnum | MedicinesScalarFieldEnum[]
  }

  /**
   * medicines create
   */
  export type medicinesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * The data needed to create a medicines.
     */
    data: XOR<medicinesCreateInput, medicinesUncheckedCreateInput>
  }

  /**
   * medicines createMany
   */
  export type medicinesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many medicines.
     */
    data: medicinesCreateManyInput | medicinesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * medicines createManyAndReturn
   */
  export type medicinesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * The data used to create many medicines.
     */
    data: medicinesCreateManyInput | medicinesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * medicines update
   */
  export type medicinesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * The data needed to update a medicines.
     */
    data: XOR<medicinesUpdateInput, medicinesUncheckedUpdateInput>
    /**
     * Choose, which medicines to update.
     */
    where: medicinesWhereUniqueInput
  }

  /**
   * medicines updateMany
   */
  export type medicinesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update medicines.
     */
    data: XOR<medicinesUpdateManyMutationInput, medicinesUncheckedUpdateManyInput>
    /**
     * Filter which medicines to update
     */
    where?: medicinesWhereInput
    /**
     * Limit how many medicines to update.
     */
    limit?: number
  }

  /**
   * medicines updateManyAndReturn
   */
  export type medicinesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * The data used to update medicines.
     */
    data: XOR<medicinesUpdateManyMutationInput, medicinesUncheckedUpdateManyInput>
    /**
     * Filter which medicines to update
     */
    where?: medicinesWhereInput
    /**
     * Limit how many medicines to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * medicines upsert
   */
  export type medicinesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * The filter to search for the medicines to update in case it exists.
     */
    where: medicinesWhereUniqueInput
    /**
     * In case the medicines found by the `where` argument doesn't exist, create a new medicines with this data.
     */
    create: XOR<medicinesCreateInput, medicinesUncheckedCreateInput>
    /**
     * In case the medicines was found with the provided `where` argument, update it with this data.
     */
    update: XOR<medicinesUpdateInput, medicinesUncheckedUpdateInput>
  }

  /**
   * medicines delete
   */
  export type medicinesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
    /**
     * Filter which medicines to delete.
     */
    where: medicinesWhereUniqueInput
  }

  /**
   * medicines deleteMany
   */
  export type medicinesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which medicines to delete
     */
    where?: medicinesWhereInput
    /**
     * Limit how many medicines to delete.
     */
    limit?: number
  }

  /**
   * medicines without action
   */
  export type medicinesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the medicines
     */
    select?: medicinesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the medicines
     */
    omit?: medicinesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: medicinesInclude<ExtArgs> | null
  }


  /**
   * Model chat_history
   */

  export type AggregateChat_history = {
    _count: Chat_historyCountAggregateOutputType | null
    _min: Chat_historyMinAggregateOutputType | null
    _max: Chat_historyMaxAggregateOutputType | null
  }

  export type Chat_historyMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    user_message: string | null
    ai_response: string | null
    created_at: Date | null
  }

  export type Chat_historyMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    user_message: string | null
    ai_response: string | null
    created_at: Date | null
  }

  export type Chat_historyCountAggregateOutputType = {
    id: number
    user_id: number
    user_message: number
    ai_response: number
    created_at: number
    _all: number
  }


  export type Chat_historyMinAggregateInputType = {
    id?: true
    user_id?: true
    user_message?: true
    ai_response?: true
    created_at?: true
  }

  export type Chat_historyMaxAggregateInputType = {
    id?: true
    user_id?: true
    user_message?: true
    ai_response?: true
    created_at?: true
  }

  export type Chat_historyCountAggregateInputType = {
    id?: true
    user_id?: true
    user_message?: true
    ai_response?: true
    created_at?: true
    _all?: true
  }

  export type Chat_historyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chat_history to aggregate.
     */
    where?: chat_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chat_histories to fetch.
     */
    orderBy?: chat_historyOrderByWithRelationInput | chat_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: chat_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chat_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chat_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned chat_histories
    **/
    _count?: true | Chat_historyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Chat_historyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Chat_historyMaxAggregateInputType
  }

  export type GetChat_historyAggregateType<T extends Chat_historyAggregateArgs> = {
        [P in keyof T & keyof AggregateChat_history]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChat_history[P]>
      : GetScalarType<T[P], AggregateChat_history[P]>
  }




  export type chat_historyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: chat_historyWhereInput
    orderBy?: chat_historyOrderByWithAggregationInput | chat_historyOrderByWithAggregationInput[]
    by: Chat_historyScalarFieldEnum[] | Chat_historyScalarFieldEnum
    having?: chat_historyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Chat_historyCountAggregateInputType | true
    _min?: Chat_historyMinAggregateInputType
    _max?: Chat_historyMaxAggregateInputType
  }

  export type Chat_historyGroupByOutputType = {
    id: string
    user_id: string
    user_message: string | null
    ai_response: string | null
    created_at: Date
    _count: Chat_historyCountAggregateOutputType | null
    _min: Chat_historyMinAggregateOutputType | null
    _max: Chat_historyMaxAggregateOutputType | null
  }

  type GetChat_historyGroupByPayload<T extends chat_historyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Chat_historyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Chat_historyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Chat_historyGroupByOutputType[P]>
            : GetScalarType<T[P], Chat_historyGroupByOutputType[P]>
        }
      >
    >


  export type chat_historySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    user_message?: boolean
    ai_response?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chat_history"]>

  export type chat_historySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    user_message?: boolean
    ai_response?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chat_history"]>

  export type chat_historySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    user_message?: boolean
    ai_response?: boolean
    created_at?: boolean
    user?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chat_history"]>

  export type chat_historySelectScalar = {
    id?: boolean
    user_id?: boolean
    user_message?: boolean
    ai_response?: boolean
    created_at?: boolean
  }

  export type chat_historyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "user_message" | "ai_response" | "created_at", ExtArgs["result"]["chat_history"]>
  export type chat_historyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type chat_historyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type chat_historyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $chat_historyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "chat_history"
    objects: {
      user: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      user_message: string | null
      ai_response: string | null
      created_at: Date
    }, ExtArgs["result"]["chat_history"]>
    composites: {}
  }

  type chat_historyGetPayload<S extends boolean | null | undefined | chat_historyDefaultArgs> = $Result.GetResult<Prisma.$chat_historyPayload, S>

  type chat_historyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<chat_historyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Chat_historyCountAggregateInputType | true
    }

  export interface chat_historyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['chat_history'], meta: { name: 'chat_history' } }
    /**
     * Find zero or one Chat_history that matches the filter.
     * @param {chat_historyFindUniqueArgs} args - Arguments to find a Chat_history
     * @example
     * // Get one Chat_history
     * const chat_history = await prisma.chat_history.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends chat_historyFindUniqueArgs>(args: SelectSubset<T, chat_historyFindUniqueArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Chat_history that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {chat_historyFindUniqueOrThrowArgs} args - Arguments to find a Chat_history
     * @example
     * // Get one Chat_history
     * const chat_history = await prisma.chat_history.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends chat_historyFindUniqueOrThrowArgs>(args: SelectSubset<T, chat_historyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chat_history that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chat_historyFindFirstArgs} args - Arguments to find a Chat_history
     * @example
     * // Get one Chat_history
     * const chat_history = await prisma.chat_history.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends chat_historyFindFirstArgs>(args?: SelectSubset<T, chat_historyFindFirstArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Chat_history that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chat_historyFindFirstOrThrowArgs} args - Arguments to find a Chat_history
     * @example
     * // Get one Chat_history
     * const chat_history = await prisma.chat_history.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends chat_historyFindFirstOrThrowArgs>(args?: SelectSubset<T, chat_historyFindFirstOrThrowArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Chat_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chat_historyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chat_histories
     * const chat_histories = await prisma.chat_history.findMany()
     * 
     * // Get first 10 Chat_histories
     * const chat_histories = await prisma.chat_history.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chat_historyWithIdOnly = await prisma.chat_history.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends chat_historyFindManyArgs>(args?: SelectSubset<T, chat_historyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Chat_history.
     * @param {chat_historyCreateArgs} args - Arguments to create a Chat_history.
     * @example
     * // Create one Chat_history
     * const Chat_history = await prisma.chat_history.create({
     *   data: {
     *     // ... data to create a Chat_history
     *   }
     * })
     * 
     */
    create<T extends chat_historyCreateArgs>(args: SelectSubset<T, chat_historyCreateArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Chat_histories.
     * @param {chat_historyCreateManyArgs} args - Arguments to create many Chat_histories.
     * @example
     * // Create many Chat_histories
     * const chat_history = await prisma.chat_history.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends chat_historyCreateManyArgs>(args?: SelectSubset<T, chat_historyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Chat_histories and returns the data saved in the database.
     * @param {chat_historyCreateManyAndReturnArgs} args - Arguments to create many Chat_histories.
     * @example
     * // Create many Chat_histories
     * const chat_history = await prisma.chat_history.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Chat_histories and only return the `id`
     * const chat_historyWithIdOnly = await prisma.chat_history.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends chat_historyCreateManyAndReturnArgs>(args?: SelectSubset<T, chat_historyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Chat_history.
     * @param {chat_historyDeleteArgs} args - Arguments to delete one Chat_history.
     * @example
     * // Delete one Chat_history
     * const Chat_history = await prisma.chat_history.delete({
     *   where: {
     *     // ... filter to delete one Chat_history
     *   }
     * })
     * 
     */
    delete<T extends chat_historyDeleteArgs>(args: SelectSubset<T, chat_historyDeleteArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Chat_history.
     * @param {chat_historyUpdateArgs} args - Arguments to update one Chat_history.
     * @example
     * // Update one Chat_history
     * const chat_history = await prisma.chat_history.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends chat_historyUpdateArgs>(args: SelectSubset<T, chat_historyUpdateArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Chat_histories.
     * @param {chat_historyDeleteManyArgs} args - Arguments to filter Chat_histories to delete.
     * @example
     * // Delete a few Chat_histories
     * const { count } = await prisma.chat_history.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends chat_historyDeleteManyArgs>(args?: SelectSubset<T, chat_historyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chat_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chat_historyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chat_histories
     * const chat_history = await prisma.chat_history.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends chat_historyUpdateManyArgs>(args: SelectSubset<T, chat_historyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Chat_histories and returns the data updated in the database.
     * @param {chat_historyUpdateManyAndReturnArgs} args - Arguments to update many Chat_histories.
     * @example
     * // Update many Chat_histories
     * const chat_history = await prisma.chat_history.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Chat_histories and only return the `id`
     * const chat_historyWithIdOnly = await prisma.chat_history.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends chat_historyUpdateManyAndReturnArgs>(args: SelectSubset<T, chat_historyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Chat_history.
     * @param {chat_historyUpsertArgs} args - Arguments to update or create a Chat_history.
     * @example
     * // Update or create a Chat_history
     * const chat_history = await prisma.chat_history.upsert({
     *   create: {
     *     // ... data to create a Chat_history
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chat_history we want to update
     *   }
     * })
     */
    upsert<T extends chat_historyUpsertArgs>(args: SelectSubset<T, chat_historyUpsertArgs<ExtArgs>>): Prisma__chat_historyClient<$Result.GetResult<Prisma.$chat_historyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Chat_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chat_historyCountArgs} args - Arguments to filter Chat_histories to count.
     * @example
     * // Count the number of Chat_histories
     * const count = await prisma.chat_history.count({
     *   where: {
     *     // ... the filter for the Chat_histories we want to count
     *   }
     * })
    **/
    count<T extends chat_historyCountArgs>(
      args?: Subset<T, chat_historyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Chat_historyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Chat_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Chat_historyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Chat_historyAggregateArgs>(args: Subset<T, Chat_historyAggregateArgs>): Prisma.PrismaPromise<GetChat_historyAggregateType<T>>

    /**
     * Group by Chat_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {chat_historyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends chat_historyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: chat_historyGroupByArgs['orderBy'] }
        : { orderBy?: chat_historyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, chat_historyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChat_historyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the chat_history model
   */
  readonly fields: chat_historyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for chat_history.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__chat_historyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the chat_history model
   */
  interface chat_historyFieldRefs {
    readonly id: FieldRef<"chat_history", 'String'>
    readonly user_id: FieldRef<"chat_history", 'String'>
    readonly user_message: FieldRef<"chat_history", 'String'>
    readonly ai_response: FieldRef<"chat_history", 'String'>
    readonly created_at: FieldRef<"chat_history", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * chat_history findUnique
   */
  export type chat_historyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * Filter, which chat_history to fetch.
     */
    where: chat_historyWhereUniqueInput
  }

  /**
   * chat_history findUniqueOrThrow
   */
  export type chat_historyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * Filter, which chat_history to fetch.
     */
    where: chat_historyWhereUniqueInput
  }

  /**
   * chat_history findFirst
   */
  export type chat_historyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * Filter, which chat_history to fetch.
     */
    where?: chat_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chat_histories to fetch.
     */
    orderBy?: chat_historyOrderByWithRelationInput | chat_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chat_histories.
     */
    cursor?: chat_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chat_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chat_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chat_histories.
     */
    distinct?: Chat_historyScalarFieldEnum | Chat_historyScalarFieldEnum[]
  }

  /**
   * chat_history findFirstOrThrow
   */
  export type chat_historyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * Filter, which chat_history to fetch.
     */
    where?: chat_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chat_histories to fetch.
     */
    orderBy?: chat_historyOrderByWithRelationInput | chat_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for chat_histories.
     */
    cursor?: chat_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chat_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chat_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chat_histories.
     */
    distinct?: Chat_historyScalarFieldEnum | Chat_historyScalarFieldEnum[]
  }

  /**
   * chat_history findMany
   */
  export type chat_historyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * Filter, which chat_histories to fetch.
     */
    where?: chat_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of chat_histories to fetch.
     */
    orderBy?: chat_historyOrderByWithRelationInput | chat_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing chat_histories.
     */
    cursor?: chat_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` chat_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` chat_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of chat_histories.
     */
    distinct?: Chat_historyScalarFieldEnum | Chat_historyScalarFieldEnum[]
  }

  /**
   * chat_history create
   */
  export type chat_historyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * The data needed to create a chat_history.
     */
    data: XOR<chat_historyCreateInput, chat_historyUncheckedCreateInput>
  }

  /**
   * chat_history createMany
   */
  export type chat_historyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many chat_histories.
     */
    data: chat_historyCreateManyInput | chat_historyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * chat_history createManyAndReturn
   */
  export type chat_historyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * The data used to create many chat_histories.
     */
    data: chat_historyCreateManyInput | chat_historyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * chat_history update
   */
  export type chat_historyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * The data needed to update a chat_history.
     */
    data: XOR<chat_historyUpdateInput, chat_historyUncheckedUpdateInput>
    /**
     * Choose, which chat_history to update.
     */
    where: chat_historyWhereUniqueInput
  }

  /**
   * chat_history updateMany
   */
  export type chat_historyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update chat_histories.
     */
    data: XOR<chat_historyUpdateManyMutationInput, chat_historyUncheckedUpdateManyInput>
    /**
     * Filter which chat_histories to update
     */
    where?: chat_historyWhereInput
    /**
     * Limit how many chat_histories to update.
     */
    limit?: number
  }

  /**
   * chat_history updateManyAndReturn
   */
  export type chat_historyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * The data used to update chat_histories.
     */
    data: XOR<chat_historyUpdateManyMutationInput, chat_historyUncheckedUpdateManyInput>
    /**
     * Filter which chat_histories to update
     */
    where?: chat_historyWhereInput
    /**
     * Limit how many chat_histories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * chat_history upsert
   */
  export type chat_historyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * The filter to search for the chat_history to update in case it exists.
     */
    where: chat_historyWhereUniqueInput
    /**
     * In case the chat_history found by the `where` argument doesn't exist, create a new chat_history with this data.
     */
    create: XOR<chat_historyCreateInput, chat_historyUncheckedCreateInput>
    /**
     * In case the chat_history was found with the provided `where` argument, update it with this data.
     */
    update: XOR<chat_historyUpdateInput, chat_historyUncheckedUpdateInput>
  }

  /**
   * chat_history delete
   */
  export type chat_historyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
    /**
     * Filter which chat_history to delete.
     */
    where: chat_historyWhereUniqueInput
  }

  /**
   * chat_history deleteMany
   */
  export type chat_historyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which chat_histories to delete
     */
    where?: chat_historyWhereInput
    /**
     * Limit how many chat_histories to delete.
     */
    limit?: number
  }

  /**
   * chat_history without action
   */
  export type chat_historyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the chat_history
     */
    select?: chat_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the chat_history
     */
    omit?: chat_historyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: chat_historyInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    created_at: 'created_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const ReportsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    file_url: 'file_url',
    report_name: 'report_name',
    summary: 'summary',
    created_at: 'created_at'
  };

  export type ReportsScalarFieldEnum = (typeof ReportsScalarFieldEnum)[keyof typeof ReportsScalarFieldEnum]


  export const Health_metricsScalarFieldEnum: {
    id: 'id',
    report_id: 'report_id',
    metric_name: 'metric_name',
    metric_value: 'metric_value',
    status: 'status',
    explanation: 'explanation',
    created_at: 'created_at'
  };

  export type Health_metricsScalarFieldEnum = (typeof Health_metricsScalarFieldEnum)[keyof typeof Health_metricsScalarFieldEnum]


  export const PrescriptionsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    file_url: 'file_url',
    extracted_text: 'extracted_text',
    created_at: 'created_at'
  };

  export type PrescriptionsScalarFieldEnum = (typeof PrescriptionsScalarFieldEnum)[keyof typeof PrescriptionsScalarFieldEnum]


  export const MedicinesScalarFieldEnum: {
    id: 'id',
    prescription_id: 'prescription_id',
    medicine_name: 'medicine_name',
    usage_info: 'usage_info',
    dosage_info: 'dosage_info',
    side_effects: 'side_effects'
  };

  export type MedicinesScalarFieldEnum = (typeof MedicinesScalarFieldEnum)[keyof typeof MedicinesScalarFieldEnum]


  export const Chat_historyScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    user_message: 'user_message',
    ai_response: 'ai_response',
    created_at: 'created_at'
  };

  export type Chat_historyScalarFieldEnum = (typeof Chat_historyScalarFieldEnum)[keyof typeof Chat_historyScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: UuidFilter<"users"> | string
    name?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    password?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    reports?: ReportsListRelationFilter
    prescriptions?: PrescriptionsListRelationFilter
    chat_history?: Chat_historyListRelationFilter
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
    reports?: reportsOrderByRelationAggregateInput
    prescriptions?: prescriptionsOrderByRelationAggregateInput
    chat_history?: chat_historyOrderByRelationAggregateInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    name?: StringFilter<"users"> | string
    password?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    reports?: ReportsListRelationFilter
    prescriptions?: PrescriptionsListRelationFilter
    chat_history?: Chat_historyListRelationFilter
  }, "id" | "email">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"users"> | string
    name?: StringWithAggregatesFilter<"users"> | string
    email?: StringWithAggregatesFilter<"users"> | string
    password?: StringWithAggregatesFilter<"users"> | string
    created_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
  }

  export type reportsWhereInput = {
    AND?: reportsWhereInput | reportsWhereInput[]
    OR?: reportsWhereInput[]
    NOT?: reportsWhereInput | reportsWhereInput[]
    id?: UuidFilter<"reports"> | string
    user_id?: UuidFilter<"reports"> | string
    file_url?: StringFilter<"reports"> | string
    report_name?: StringNullableFilter<"reports"> | string | null
    summary?: StringNullableFilter<"reports"> | string | null
    created_at?: DateTimeFilter<"reports"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
    health_metrics?: Health_metricsListRelationFilter
  }

  export type reportsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    report_name?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: usersOrderByWithRelationInput
    health_metrics?: health_metricsOrderByRelationAggregateInput
  }

  export type reportsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: reportsWhereInput | reportsWhereInput[]
    OR?: reportsWhereInput[]
    NOT?: reportsWhereInput | reportsWhereInput[]
    user_id?: UuidFilter<"reports"> | string
    file_url?: StringFilter<"reports"> | string
    report_name?: StringNullableFilter<"reports"> | string | null
    summary?: StringNullableFilter<"reports"> | string | null
    created_at?: DateTimeFilter<"reports"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
    health_metrics?: Health_metricsListRelationFilter
  }, "id">

  export type reportsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    report_name?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: reportsCountOrderByAggregateInput
    _max?: reportsMaxOrderByAggregateInput
    _min?: reportsMinOrderByAggregateInput
  }

  export type reportsScalarWhereWithAggregatesInput = {
    AND?: reportsScalarWhereWithAggregatesInput | reportsScalarWhereWithAggregatesInput[]
    OR?: reportsScalarWhereWithAggregatesInput[]
    NOT?: reportsScalarWhereWithAggregatesInput | reportsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"reports"> | string
    user_id?: UuidWithAggregatesFilter<"reports"> | string
    file_url?: StringWithAggregatesFilter<"reports"> | string
    report_name?: StringNullableWithAggregatesFilter<"reports"> | string | null
    summary?: StringNullableWithAggregatesFilter<"reports"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"reports"> | Date | string
  }

  export type health_metricsWhereInput = {
    AND?: health_metricsWhereInput | health_metricsWhereInput[]
    OR?: health_metricsWhereInput[]
    NOT?: health_metricsWhereInput | health_metricsWhereInput[]
    id?: UuidFilter<"health_metrics"> | string
    report_id?: UuidFilter<"health_metrics"> | string
    metric_name?: StringNullableFilter<"health_metrics"> | string | null
    metric_value?: StringNullableFilter<"health_metrics"> | string | null
    status?: StringNullableFilter<"health_metrics"> | string | null
    explanation?: StringNullableFilter<"health_metrics"> | string | null
    created_at?: DateTimeFilter<"health_metrics"> | Date | string
    report?: XOR<ReportsScalarRelationFilter, reportsWhereInput>
  }

  export type health_metricsOrderByWithRelationInput = {
    id?: SortOrder
    report_id?: SortOrder
    metric_name?: SortOrderInput | SortOrder
    metric_value?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    explanation?: SortOrderInput | SortOrder
    created_at?: SortOrder
    report?: reportsOrderByWithRelationInput
  }

  export type health_metricsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: health_metricsWhereInput | health_metricsWhereInput[]
    OR?: health_metricsWhereInput[]
    NOT?: health_metricsWhereInput | health_metricsWhereInput[]
    report_id?: UuidFilter<"health_metrics"> | string
    metric_name?: StringNullableFilter<"health_metrics"> | string | null
    metric_value?: StringNullableFilter<"health_metrics"> | string | null
    status?: StringNullableFilter<"health_metrics"> | string | null
    explanation?: StringNullableFilter<"health_metrics"> | string | null
    created_at?: DateTimeFilter<"health_metrics"> | Date | string
    report?: XOR<ReportsScalarRelationFilter, reportsWhereInput>
  }, "id">

  export type health_metricsOrderByWithAggregationInput = {
    id?: SortOrder
    report_id?: SortOrder
    metric_name?: SortOrderInput | SortOrder
    metric_value?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    explanation?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: health_metricsCountOrderByAggregateInput
    _max?: health_metricsMaxOrderByAggregateInput
    _min?: health_metricsMinOrderByAggregateInput
  }

  export type health_metricsScalarWhereWithAggregatesInput = {
    AND?: health_metricsScalarWhereWithAggregatesInput | health_metricsScalarWhereWithAggregatesInput[]
    OR?: health_metricsScalarWhereWithAggregatesInput[]
    NOT?: health_metricsScalarWhereWithAggregatesInput | health_metricsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"health_metrics"> | string
    report_id?: UuidWithAggregatesFilter<"health_metrics"> | string
    metric_name?: StringNullableWithAggregatesFilter<"health_metrics"> | string | null
    metric_value?: StringNullableWithAggregatesFilter<"health_metrics"> | string | null
    status?: StringNullableWithAggregatesFilter<"health_metrics"> | string | null
    explanation?: StringNullableWithAggregatesFilter<"health_metrics"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"health_metrics"> | Date | string
  }

  export type prescriptionsWhereInput = {
    AND?: prescriptionsWhereInput | prescriptionsWhereInput[]
    OR?: prescriptionsWhereInput[]
    NOT?: prescriptionsWhereInput | prescriptionsWhereInput[]
    id?: UuidFilter<"prescriptions"> | string
    user_id?: UuidFilter<"prescriptions"> | string
    file_url?: StringFilter<"prescriptions"> | string
    extracted_text?: StringNullableFilter<"prescriptions"> | string | null
    created_at?: DateTimeFilter<"prescriptions"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
    medicines?: MedicinesListRelationFilter
  }

  export type prescriptionsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    extracted_text?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: usersOrderByWithRelationInput
    medicines?: medicinesOrderByRelationAggregateInput
  }

  export type prescriptionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: prescriptionsWhereInput | prescriptionsWhereInput[]
    OR?: prescriptionsWhereInput[]
    NOT?: prescriptionsWhereInput | prescriptionsWhereInput[]
    user_id?: UuidFilter<"prescriptions"> | string
    file_url?: StringFilter<"prescriptions"> | string
    extracted_text?: StringNullableFilter<"prescriptions"> | string | null
    created_at?: DateTimeFilter<"prescriptions"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
    medicines?: MedicinesListRelationFilter
  }, "id">

  export type prescriptionsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    extracted_text?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: prescriptionsCountOrderByAggregateInput
    _max?: prescriptionsMaxOrderByAggregateInput
    _min?: prescriptionsMinOrderByAggregateInput
  }

  export type prescriptionsScalarWhereWithAggregatesInput = {
    AND?: prescriptionsScalarWhereWithAggregatesInput | prescriptionsScalarWhereWithAggregatesInput[]
    OR?: prescriptionsScalarWhereWithAggregatesInput[]
    NOT?: prescriptionsScalarWhereWithAggregatesInput | prescriptionsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"prescriptions"> | string
    user_id?: UuidWithAggregatesFilter<"prescriptions"> | string
    file_url?: StringWithAggregatesFilter<"prescriptions"> | string
    extracted_text?: StringNullableWithAggregatesFilter<"prescriptions"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"prescriptions"> | Date | string
  }

  export type medicinesWhereInput = {
    AND?: medicinesWhereInput | medicinesWhereInput[]
    OR?: medicinesWhereInput[]
    NOT?: medicinesWhereInput | medicinesWhereInput[]
    id?: UuidFilter<"medicines"> | string
    prescription_id?: UuidFilter<"medicines"> | string
    medicine_name?: StringNullableFilter<"medicines"> | string | null
    usage_info?: StringNullableFilter<"medicines"> | string | null
    dosage_info?: StringNullableFilter<"medicines"> | string | null
    side_effects?: StringNullableFilter<"medicines"> | string | null
    prescription?: XOR<PrescriptionsScalarRelationFilter, prescriptionsWhereInput>
  }

  export type medicinesOrderByWithRelationInput = {
    id?: SortOrder
    prescription_id?: SortOrder
    medicine_name?: SortOrderInput | SortOrder
    usage_info?: SortOrderInput | SortOrder
    dosage_info?: SortOrderInput | SortOrder
    side_effects?: SortOrderInput | SortOrder
    prescription?: prescriptionsOrderByWithRelationInput
  }

  export type medicinesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    prescription_id_medicine_name?: medicinesPrescription_idMedicine_nameCompoundUniqueInput
    AND?: medicinesWhereInput | medicinesWhereInput[]
    OR?: medicinesWhereInput[]
    NOT?: medicinesWhereInput | medicinesWhereInput[]
    prescription_id?: UuidFilter<"medicines"> | string
    medicine_name?: StringNullableFilter<"medicines"> | string | null
    usage_info?: StringNullableFilter<"medicines"> | string | null
    dosage_info?: StringNullableFilter<"medicines"> | string | null
    side_effects?: StringNullableFilter<"medicines"> | string | null
    prescription?: XOR<PrescriptionsScalarRelationFilter, prescriptionsWhereInput>
  }, "id" | "prescription_id_medicine_name">

  export type medicinesOrderByWithAggregationInput = {
    id?: SortOrder
    prescription_id?: SortOrder
    medicine_name?: SortOrderInput | SortOrder
    usage_info?: SortOrderInput | SortOrder
    dosage_info?: SortOrderInput | SortOrder
    side_effects?: SortOrderInput | SortOrder
    _count?: medicinesCountOrderByAggregateInput
    _max?: medicinesMaxOrderByAggregateInput
    _min?: medicinesMinOrderByAggregateInput
  }

  export type medicinesScalarWhereWithAggregatesInput = {
    AND?: medicinesScalarWhereWithAggregatesInput | medicinesScalarWhereWithAggregatesInput[]
    OR?: medicinesScalarWhereWithAggregatesInput[]
    NOT?: medicinesScalarWhereWithAggregatesInput | medicinesScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"medicines"> | string
    prescription_id?: UuidWithAggregatesFilter<"medicines"> | string
    medicine_name?: StringNullableWithAggregatesFilter<"medicines"> | string | null
    usage_info?: StringNullableWithAggregatesFilter<"medicines"> | string | null
    dosage_info?: StringNullableWithAggregatesFilter<"medicines"> | string | null
    side_effects?: StringNullableWithAggregatesFilter<"medicines"> | string | null
  }

  export type chat_historyWhereInput = {
    AND?: chat_historyWhereInput | chat_historyWhereInput[]
    OR?: chat_historyWhereInput[]
    NOT?: chat_historyWhereInput | chat_historyWhereInput[]
    id?: UuidFilter<"chat_history"> | string
    user_id?: UuidFilter<"chat_history"> | string
    user_message?: StringNullableFilter<"chat_history"> | string | null
    ai_response?: StringNullableFilter<"chat_history"> | string | null
    created_at?: DateTimeFilter<"chat_history"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type chat_historyOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_message?: SortOrderInput | SortOrder
    ai_response?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: usersOrderByWithRelationInput
  }

  export type chat_historyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: chat_historyWhereInput | chat_historyWhereInput[]
    OR?: chat_historyWhereInput[]
    NOT?: chat_historyWhereInput | chat_historyWhereInput[]
    user_id?: UuidFilter<"chat_history"> | string
    user_message?: StringNullableFilter<"chat_history"> | string | null
    ai_response?: StringNullableFilter<"chat_history"> | string | null
    created_at?: DateTimeFilter<"chat_history"> | Date | string
    user?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "id">

  export type chat_historyOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_message?: SortOrderInput | SortOrder
    ai_response?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: chat_historyCountOrderByAggregateInput
    _max?: chat_historyMaxOrderByAggregateInput
    _min?: chat_historyMinOrderByAggregateInput
  }

  export type chat_historyScalarWhereWithAggregatesInput = {
    AND?: chat_historyScalarWhereWithAggregatesInput | chat_historyScalarWhereWithAggregatesInput[]
    OR?: chat_historyScalarWhereWithAggregatesInput[]
    NOT?: chat_historyScalarWhereWithAggregatesInput | chat_historyScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"chat_history"> | string
    user_id?: UuidWithAggregatesFilter<"chat_history"> | string
    user_message?: StringNullableWithAggregatesFilter<"chat_history"> | string | null
    ai_response?: StringNullableWithAggregatesFilter<"chat_history"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"chat_history"> | Date | string
  }

  export type usersCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    reports?: reportsCreateNestedManyWithoutUserInput
    prescriptions?: prescriptionsCreateNestedManyWithoutUserInput
    chat_history?: chat_historyCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    reports?: reportsUncheckedCreateNestedManyWithoutUserInput
    prescriptions?: prescriptionsUncheckedCreateNestedManyWithoutUserInput
    chat_history?: chat_historyUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUpdateManyWithoutUserNestedInput
    prescriptions?: prescriptionsUpdateManyWithoutUserNestedInput
    chat_history?: chat_historyUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUncheckedUpdateManyWithoutUserNestedInput
    prescriptions?: prescriptionsUncheckedUpdateManyWithoutUserNestedInput
    chat_history?: chat_historyUncheckedUpdateManyWithoutUserNestedInput
  }

  export type usersCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
  }

  export type usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reportsCreateInput = {
    id?: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
    user: usersCreateNestedOneWithoutReportsInput
    health_metrics?: health_metricsCreateNestedManyWithoutReportInput
  }

  export type reportsUncheckedCreateInput = {
    id?: string
    user_id: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
    health_metrics?: health_metricsUncheckedCreateNestedManyWithoutReportInput
  }

  export type reportsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutReportsNestedInput
    health_metrics?: health_metricsUpdateManyWithoutReportNestedInput
  }

  export type reportsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    health_metrics?: health_metricsUncheckedUpdateManyWithoutReportNestedInput
  }

  export type reportsCreateManyInput = {
    id?: string
    user_id: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
  }

  export type reportsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reportsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type health_metricsCreateInput = {
    id?: string
    metric_name?: string | null
    metric_value?: string | null
    status?: string | null
    explanation?: string | null
    created_at?: Date | string
    report: reportsCreateNestedOneWithoutHealth_metricsInput
  }

  export type health_metricsUncheckedCreateInput = {
    id?: string
    report_id: string
    metric_name?: string | null
    metric_value?: string | null
    status?: string | null
    explanation?: string | null
    created_at?: Date | string
  }

  export type health_metricsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    report?: reportsUpdateOneRequiredWithoutHealth_metricsNestedInput
  }

  export type health_metricsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    report_id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type health_metricsCreateManyInput = {
    id?: string
    report_id: string
    metric_name?: string | null
    metric_value?: string | null
    status?: string | null
    explanation?: string | null
    created_at?: Date | string
  }

  export type health_metricsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type health_metricsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    report_id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type prescriptionsCreateInput = {
    id?: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
    user: usersCreateNestedOneWithoutPrescriptionsInput
    medicines?: medicinesCreateNestedManyWithoutPrescriptionInput
  }

  export type prescriptionsUncheckedCreateInput = {
    id?: string
    user_id: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
    medicines?: medicinesUncheckedCreateNestedManyWithoutPrescriptionInput
  }

  export type prescriptionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutPrescriptionsNestedInput
    medicines?: medicinesUpdateManyWithoutPrescriptionNestedInput
  }

  export type prescriptionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    medicines?: medicinesUncheckedUpdateManyWithoutPrescriptionNestedInput
  }

  export type prescriptionsCreateManyInput = {
    id?: string
    user_id: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
  }

  export type prescriptionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type prescriptionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type medicinesCreateInput = {
    id?: string
    medicine_name?: string | null
    usage_info?: string | null
    dosage_info?: string | null
    side_effects?: string | null
    prescription: prescriptionsCreateNestedOneWithoutMedicinesInput
  }

  export type medicinesUncheckedCreateInput = {
    id?: string
    prescription_id: string
    medicine_name?: string | null
    usage_info?: string | null
    dosage_info?: string | null
    side_effects?: string | null
  }

  export type medicinesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
    prescription?: prescriptionsUpdateOneRequiredWithoutMedicinesNestedInput
  }

  export type medicinesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescription_id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type medicinesCreateManyInput = {
    id?: string
    prescription_id: string
    medicine_name?: string | null
    usage_info?: string | null
    dosage_info?: string | null
    side_effects?: string | null
  }

  export type medicinesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type medicinesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prescription_id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type chat_historyCreateInput = {
    id?: string
    user_message?: string | null
    ai_response?: string | null
    created_at?: Date | string
    user: usersCreateNestedOneWithoutChat_historyInput
  }

  export type chat_historyUncheckedCreateInput = {
    id?: string
    user_id: string
    user_message?: string | null
    ai_response?: string | null
    created_at?: Date | string
  }

  export type chat_historyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutChat_historyNestedInput
  }

  export type chat_historyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chat_historyCreateManyInput = {
    id?: string
    user_id: string
    user_message?: string | null
    ai_response?: string | null
    created_at?: Date | string
  }

  export type chat_historyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chat_historyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReportsListRelationFilter = {
    every?: reportsWhereInput
    some?: reportsWhereInput
    none?: reportsWhereInput
  }

  export type PrescriptionsListRelationFilter = {
    every?: prescriptionsWhereInput
    some?: prescriptionsWhereInput
    none?: prescriptionsWhereInput
  }

  export type Chat_historyListRelationFilter = {
    every?: chat_historyWhereInput
    some?: chat_historyWhereInput
    none?: chat_historyWhereInput
  }

  export type reportsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type prescriptionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type chat_historyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    created_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type Health_metricsListRelationFilter = {
    every?: health_metricsWhereInput
    some?: health_metricsWhereInput
    none?: health_metricsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type health_metricsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type reportsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    report_name?: SortOrder
    summary?: SortOrder
    created_at?: SortOrder
  }

  export type reportsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    report_name?: SortOrder
    summary?: SortOrder
    created_at?: SortOrder
  }

  export type reportsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    report_name?: SortOrder
    summary?: SortOrder
    created_at?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type ReportsScalarRelationFilter = {
    is?: reportsWhereInput
    isNot?: reportsWhereInput
  }

  export type health_metricsCountOrderByAggregateInput = {
    id?: SortOrder
    report_id?: SortOrder
    metric_name?: SortOrder
    metric_value?: SortOrder
    status?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrder
  }

  export type health_metricsMaxOrderByAggregateInput = {
    id?: SortOrder
    report_id?: SortOrder
    metric_name?: SortOrder
    metric_value?: SortOrder
    status?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrder
  }

  export type health_metricsMinOrderByAggregateInput = {
    id?: SortOrder
    report_id?: SortOrder
    metric_name?: SortOrder
    metric_value?: SortOrder
    status?: SortOrder
    explanation?: SortOrder
    created_at?: SortOrder
  }

  export type MedicinesListRelationFilter = {
    every?: medicinesWhereInput
    some?: medicinesWhereInput
    none?: medicinesWhereInput
  }

  export type medicinesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type prescriptionsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    extracted_text?: SortOrder
    created_at?: SortOrder
  }

  export type prescriptionsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    extracted_text?: SortOrder
    created_at?: SortOrder
  }

  export type prescriptionsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    file_url?: SortOrder
    extracted_text?: SortOrder
    created_at?: SortOrder
  }

  export type PrescriptionsScalarRelationFilter = {
    is?: prescriptionsWhereInput
    isNot?: prescriptionsWhereInput
  }

  export type medicinesPrescription_idMedicine_nameCompoundUniqueInput = {
    prescription_id: string
    medicine_name: string
  }

  export type medicinesCountOrderByAggregateInput = {
    id?: SortOrder
    prescription_id?: SortOrder
    medicine_name?: SortOrder
    usage_info?: SortOrder
    dosage_info?: SortOrder
    side_effects?: SortOrder
  }

  export type medicinesMaxOrderByAggregateInput = {
    id?: SortOrder
    prescription_id?: SortOrder
    medicine_name?: SortOrder
    usage_info?: SortOrder
    dosage_info?: SortOrder
    side_effects?: SortOrder
  }

  export type medicinesMinOrderByAggregateInput = {
    id?: SortOrder
    prescription_id?: SortOrder
    medicine_name?: SortOrder
    usage_info?: SortOrder
    dosage_info?: SortOrder
    side_effects?: SortOrder
  }

  export type chat_historyCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_message?: SortOrder
    ai_response?: SortOrder
    created_at?: SortOrder
  }

  export type chat_historyMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_message?: SortOrder
    ai_response?: SortOrder
    created_at?: SortOrder
  }

  export type chat_historyMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    user_message?: SortOrder
    ai_response?: SortOrder
    created_at?: SortOrder
  }

  export type reportsCreateNestedManyWithoutUserInput = {
    create?: XOR<reportsCreateWithoutUserInput, reportsUncheckedCreateWithoutUserInput> | reportsCreateWithoutUserInput[] | reportsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUserInput | reportsCreateOrConnectWithoutUserInput[]
    createMany?: reportsCreateManyUserInputEnvelope
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
  }

  export type prescriptionsCreateNestedManyWithoutUserInput = {
    create?: XOR<prescriptionsCreateWithoutUserInput, prescriptionsUncheckedCreateWithoutUserInput> | prescriptionsCreateWithoutUserInput[] | prescriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: prescriptionsCreateOrConnectWithoutUserInput | prescriptionsCreateOrConnectWithoutUserInput[]
    createMany?: prescriptionsCreateManyUserInputEnvelope
    connect?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
  }

  export type chat_historyCreateNestedManyWithoutUserInput = {
    create?: XOR<chat_historyCreateWithoutUserInput, chat_historyUncheckedCreateWithoutUserInput> | chat_historyCreateWithoutUserInput[] | chat_historyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: chat_historyCreateOrConnectWithoutUserInput | chat_historyCreateOrConnectWithoutUserInput[]
    createMany?: chat_historyCreateManyUserInputEnvelope
    connect?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
  }

  export type reportsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<reportsCreateWithoutUserInput, reportsUncheckedCreateWithoutUserInput> | reportsCreateWithoutUserInput[] | reportsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUserInput | reportsCreateOrConnectWithoutUserInput[]
    createMany?: reportsCreateManyUserInputEnvelope
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
  }

  export type prescriptionsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<prescriptionsCreateWithoutUserInput, prescriptionsUncheckedCreateWithoutUserInput> | prescriptionsCreateWithoutUserInput[] | prescriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: prescriptionsCreateOrConnectWithoutUserInput | prescriptionsCreateOrConnectWithoutUserInput[]
    createMany?: prescriptionsCreateManyUserInputEnvelope
    connect?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
  }

  export type chat_historyUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<chat_historyCreateWithoutUserInput, chat_historyUncheckedCreateWithoutUserInput> | chat_historyCreateWithoutUserInput[] | chat_historyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: chat_historyCreateOrConnectWithoutUserInput | chat_historyCreateOrConnectWithoutUserInput[]
    createMany?: chat_historyCreateManyUserInputEnvelope
    connect?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type reportsUpdateManyWithoutUserNestedInput = {
    create?: XOR<reportsCreateWithoutUserInput, reportsUncheckedCreateWithoutUserInput> | reportsCreateWithoutUserInput[] | reportsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUserInput | reportsCreateOrConnectWithoutUserInput[]
    upsert?: reportsUpsertWithWhereUniqueWithoutUserInput | reportsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: reportsCreateManyUserInputEnvelope
    set?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    disconnect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    delete?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    update?: reportsUpdateWithWhereUniqueWithoutUserInput | reportsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: reportsUpdateManyWithWhereWithoutUserInput | reportsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: reportsScalarWhereInput | reportsScalarWhereInput[]
  }

  export type prescriptionsUpdateManyWithoutUserNestedInput = {
    create?: XOR<prescriptionsCreateWithoutUserInput, prescriptionsUncheckedCreateWithoutUserInput> | prescriptionsCreateWithoutUserInput[] | prescriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: prescriptionsCreateOrConnectWithoutUserInput | prescriptionsCreateOrConnectWithoutUserInput[]
    upsert?: prescriptionsUpsertWithWhereUniqueWithoutUserInput | prescriptionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: prescriptionsCreateManyUserInputEnvelope
    set?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    disconnect?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    delete?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    connect?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    update?: prescriptionsUpdateWithWhereUniqueWithoutUserInput | prescriptionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: prescriptionsUpdateManyWithWhereWithoutUserInput | prescriptionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: prescriptionsScalarWhereInput | prescriptionsScalarWhereInput[]
  }

  export type chat_historyUpdateManyWithoutUserNestedInput = {
    create?: XOR<chat_historyCreateWithoutUserInput, chat_historyUncheckedCreateWithoutUserInput> | chat_historyCreateWithoutUserInput[] | chat_historyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: chat_historyCreateOrConnectWithoutUserInput | chat_historyCreateOrConnectWithoutUserInput[]
    upsert?: chat_historyUpsertWithWhereUniqueWithoutUserInput | chat_historyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: chat_historyCreateManyUserInputEnvelope
    set?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    disconnect?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    delete?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    connect?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    update?: chat_historyUpdateWithWhereUniqueWithoutUserInput | chat_historyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: chat_historyUpdateManyWithWhereWithoutUserInput | chat_historyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: chat_historyScalarWhereInput | chat_historyScalarWhereInput[]
  }

  export type reportsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<reportsCreateWithoutUserInput, reportsUncheckedCreateWithoutUserInput> | reportsCreateWithoutUserInput[] | reportsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUserInput | reportsCreateOrConnectWithoutUserInput[]
    upsert?: reportsUpsertWithWhereUniqueWithoutUserInput | reportsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: reportsCreateManyUserInputEnvelope
    set?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    disconnect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    delete?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    update?: reportsUpdateWithWhereUniqueWithoutUserInput | reportsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: reportsUpdateManyWithWhereWithoutUserInput | reportsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: reportsScalarWhereInput | reportsScalarWhereInput[]
  }

  export type prescriptionsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<prescriptionsCreateWithoutUserInput, prescriptionsUncheckedCreateWithoutUserInput> | prescriptionsCreateWithoutUserInput[] | prescriptionsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: prescriptionsCreateOrConnectWithoutUserInput | prescriptionsCreateOrConnectWithoutUserInput[]
    upsert?: prescriptionsUpsertWithWhereUniqueWithoutUserInput | prescriptionsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: prescriptionsCreateManyUserInputEnvelope
    set?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    disconnect?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    delete?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    connect?: prescriptionsWhereUniqueInput | prescriptionsWhereUniqueInput[]
    update?: prescriptionsUpdateWithWhereUniqueWithoutUserInput | prescriptionsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: prescriptionsUpdateManyWithWhereWithoutUserInput | prescriptionsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: prescriptionsScalarWhereInput | prescriptionsScalarWhereInput[]
  }

  export type chat_historyUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<chat_historyCreateWithoutUserInput, chat_historyUncheckedCreateWithoutUserInput> | chat_historyCreateWithoutUserInput[] | chat_historyUncheckedCreateWithoutUserInput[]
    connectOrCreate?: chat_historyCreateOrConnectWithoutUserInput | chat_historyCreateOrConnectWithoutUserInput[]
    upsert?: chat_historyUpsertWithWhereUniqueWithoutUserInput | chat_historyUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: chat_historyCreateManyUserInputEnvelope
    set?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    disconnect?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    delete?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    connect?: chat_historyWhereUniqueInput | chat_historyWhereUniqueInput[]
    update?: chat_historyUpdateWithWhereUniqueWithoutUserInput | chat_historyUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: chat_historyUpdateManyWithWhereWithoutUserInput | chat_historyUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: chat_historyScalarWhereInput | chat_historyScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutReportsInput = {
    create?: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
    connectOrCreate?: usersCreateOrConnectWithoutReportsInput
    connect?: usersWhereUniqueInput
  }

  export type health_metricsCreateNestedManyWithoutReportInput = {
    create?: XOR<health_metricsCreateWithoutReportInput, health_metricsUncheckedCreateWithoutReportInput> | health_metricsCreateWithoutReportInput[] | health_metricsUncheckedCreateWithoutReportInput[]
    connectOrCreate?: health_metricsCreateOrConnectWithoutReportInput | health_metricsCreateOrConnectWithoutReportInput[]
    createMany?: health_metricsCreateManyReportInputEnvelope
    connect?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
  }

  export type health_metricsUncheckedCreateNestedManyWithoutReportInput = {
    create?: XOR<health_metricsCreateWithoutReportInput, health_metricsUncheckedCreateWithoutReportInput> | health_metricsCreateWithoutReportInput[] | health_metricsUncheckedCreateWithoutReportInput[]
    connectOrCreate?: health_metricsCreateOrConnectWithoutReportInput | health_metricsCreateOrConnectWithoutReportInput[]
    createMany?: health_metricsCreateManyReportInputEnvelope
    connect?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type usersUpdateOneRequiredWithoutReportsNestedInput = {
    create?: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
    connectOrCreate?: usersCreateOrConnectWithoutReportsInput
    upsert?: usersUpsertWithoutReportsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutReportsInput, usersUpdateWithoutReportsInput>, usersUncheckedUpdateWithoutReportsInput>
  }

  export type health_metricsUpdateManyWithoutReportNestedInput = {
    create?: XOR<health_metricsCreateWithoutReportInput, health_metricsUncheckedCreateWithoutReportInput> | health_metricsCreateWithoutReportInput[] | health_metricsUncheckedCreateWithoutReportInput[]
    connectOrCreate?: health_metricsCreateOrConnectWithoutReportInput | health_metricsCreateOrConnectWithoutReportInput[]
    upsert?: health_metricsUpsertWithWhereUniqueWithoutReportInput | health_metricsUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: health_metricsCreateManyReportInputEnvelope
    set?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    disconnect?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    delete?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    connect?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    update?: health_metricsUpdateWithWhereUniqueWithoutReportInput | health_metricsUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: health_metricsUpdateManyWithWhereWithoutReportInput | health_metricsUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: health_metricsScalarWhereInput | health_metricsScalarWhereInput[]
  }

  export type health_metricsUncheckedUpdateManyWithoutReportNestedInput = {
    create?: XOR<health_metricsCreateWithoutReportInput, health_metricsUncheckedCreateWithoutReportInput> | health_metricsCreateWithoutReportInput[] | health_metricsUncheckedCreateWithoutReportInput[]
    connectOrCreate?: health_metricsCreateOrConnectWithoutReportInput | health_metricsCreateOrConnectWithoutReportInput[]
    upsert?: health_metricsUpsertWithWhereUniqueWithoutReportInput | health_metricsUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: health_metricsCreateManyReportInputEnvelope
    set?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    disconnect?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    delete?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    connect?: health_metricsWhereUniqueInput | health_metricsWhereUniqueInput[]
    update?: health_metricsUpdateWithWhereUniqueWithoutReportInput | health_metricsUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: health_metricsUpdateManyWithWhereWithoutReportInput | health_metricsUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: health_metricsScalarWhereInput | health_metricsScalarWhereInput[]
  }

  export type reportsCreateNestedOneWithoutHealth_metricsInput = {
    create?: XOR<reportsCreateWithoutHealth_metricsInput, reportsUncheckedCreateWithoutHealth_metricsInput>
    connectOrCreate?: reportsCreateOrConnectWithoutHealth_metricsInput
    connect?: reportsWhereUniqueInput
  }

  export type reportsUpdateOneRequiredWithoutHealth_metricsNestedInput = {
    create?: XOR<reportsCreateWithoutHealth_metricsInput, reportsUncheckedCreateWithoutHealth_metricsInput>
    connectOrCreate?: reportsCreateOrConnectWithoutHealth_metricsInput
    upsert?: reportsUpsertWithoutHealth_metricsInput
    connect?: reportsWhereUniqueInput
    update?: XOR<XOR<reportsUpdateToOneWithWhereWithoutHealth_metricsInput, reportsUpdateWithoutHealth_metricsInput>, reportsUncheckedUpdateWithoutHealth_metricsInput>
  }

  export type usersCreateNestedOneWithoutPrescriptionsInput = {
    create?: XOR<usersCreateWithoutPrescriptionsInput, usersUncheckedCreateWithoutPrescriptionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutPrescriptionsInput
    connect?: usersWhereUniqueInput
  }

  export type medicinesCreateNestedManyWithoutPrescriptionInput = {
    create?: XOR<medicinesCreateWithoutPrescriptionInput, medicinesUncheckedCreateWithoutPrescriptionInput> | medicinesCreateWithoutPrescriptionInput[] | medicinesUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: medicinesCreateOrConnectWithoutPrescriptionInput | medicinesCreateOrConnectWithoutPrescriptionInput[]
    createMany?: medicinesCreateManyPrescriptionInputEnvelope
    connect?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
  }

  export type medicinesUncheckedCreateNestedManyWithoutPrescriptionInput = {
    create?: XOR<medicinesCreateWithoutPrescriptionInput, medicinesUncheckedCreateWithoutPrescriptionInput> | medicinesCreateWithoutPrescriptionInput[] | medicinesUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: medicinesCreateOrConnectWithoutPrescriptionInput | medicinesCreateOrConnectWithoutPrescriptionInput[]
    createMany?: medicinesCreateManyPrescriptionInputEnvelope
    connect?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
  }

  export type usersUpdateOneRequiredWithoutPrescriptionsNestedInput = {
    create?: XOR<usersCreateWithoutPrescriptionsInput, usersUncheckedCreateWithoutPrescriptionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutPrescriptionsInput
    upsert?: usersUpsertWithoutPrescriptionsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutPrescriptionsInput, usersUpdateWithoutPrescriptionsInput>, usersUncheckedUpdateWithoutPrescriptionsInput>
  }

  export type medicinesUpdateManyWithoutPrescriptionNestedInput = {
    create?: XOR<medicinesCreateWithoutPrescriptionInput, medicinesUncheckedCreateWithoutPrescriptionInput> | medicinesCreateWithoutPrescriptionInput[] | medicinesUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: medicinesCreateOrConnectWithoutPrescriptionInput | medicinesCreateOrConnectWithoutPrescriptionInput[]
    upsert?: medicinesUpsertWithWhereUniqueWithoutPrescriptionInput | medicinesUpsertWithWhereUniqueWithoutPrescriptionInput[]
    createMany?: medicinesCreateManyPrescriptionInputEnvelope
    set?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    disconnect?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    delete?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    connect?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    update?: medicinesUpdateWithWhereUniqueWithoutPrescriptionInput | medicinesUpdateWithWhereUniqueWithoutPrescriptionInput[]
    updateMany?: medicinesUpdateManyWithWhereWithoutPrescriptionInput | medicinesUpdateManyWithWhereWithoutPrescriptionInput[]
    deleteMany?: medicinesScalarWhereInput | medicinesScalarWhereInput[]
  }

  export type medicinesUncheckedUpdateManyWithoutPrescriptionNestedInput = {
    create?: XOR<medicinesCreateWithoutPrescriptionInput, medicinesUncheckedCreateWithoutPrescriptionInput> | medicinesCreateWithoutPrescriptionInput[] | medicinesUncheckedCreateWithoutPrescriptionInput[]
    connectOrCreate?: medicinesCreateOrConnectWithoutPrescriptionInput | medicinesCreateOrConnectWithoutPrescriptionInput[]
    upsert?: medicinesUpsertWithWhereUniqueWithoutPrescriptionInput | medicinesUpsertWithWhereUniqueWithoutPrescriptionInput[]
    createMany?: medicinesCreateManyPrescriptionInputEnvelope
    set?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    disconnect?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    delete?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    connect?: medicinesWhereUniqueInput | medicinesWhereUniqueInput[]
    update?: medicinesUpdateWithWhereUniqueWithoutPrescriptionInput | medicinesUpdateWithWhereUniqueWithoutPrescriptionInput[]
    updateMany?: medicinesUpdateManyWithWhereWithoutPrescriptionInput | medicinesUpdateManyWithWhereWithoutPrescriptionInput[]
    deleteMany?: medicinesScalarWhereInput | medicinesScalarWhereInput[]
  }

  export type prescriptionsCreateNestedOneWithoutMedicinesInput = {
    create?: XOR<prescriptionsCreateWithoutMedicinesInput, prescriptionsUncheckedCreateWithoutMedicinesInput>
    connectOrCreate?: prescriptionsCreateOrConnectWithoutMedicinesInput
    connect?: prescriptionsWhereUniqueInput
  }

  export type prescriptionsUpdateOneRequiredWithoutMedicinesNestedInput = {
    create?: XOR<prescriptionsCreateWithoutMedicinesInput, prescriptionsUncheckedCreateWithoutMedicinesInput>
    connectOrCreate?: prescriptionsCreateOrConnectWithoutMedicinesInput
    upsert?: prescriptionsUpsertWithoutMedicinesInput
    connect?: prescriptionsWhereUniqueInput
    update?: XOR<XOR<prescriptionsUpdateToOneWithWhereWithoutMedicinesInput, prescriptionsUpdateWithoutMedicinesInput>, prescriptionsUncheckedUpdateWithoutMedicinesInput>
  }

  export type usersCreateNestedOneWithoutChat_historyInput = {
    create?: XOR<usersCreateWithoutChat_historyInput, usersUncheckedCreateWithoutChat_historyInput>
    connectOrCreate?: usersCreateOrConnectWithoutChat_historyInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutChat_historyNestedInput = {
    create?: XOR<usersCreateWithoutChat_historyInput, usersUncheckedCreateWithoutChat_historyInput>
    connectOrCreate?: usersCreateOrConnectWithoutChat_historyInput
    upsert?: usersUpsertWithoutChat_historyInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutChat_historyInput, usersUpdateWithoutChat_historyInput>, usersUncheckedUpdateWithoutChat_historyInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type reportsCreateWithoutUserInput = {
    id?: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
    health_metrics?: health_metricsCreateNestedManyWithoutReportInput
  }

  export type reportsUncheckedCreateWithoutUserInput = {
    id?: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
    health_metrics?: health_metricsUncheckedCreateNestedManyWithoutReportInput
  }

  export type reportsCreateOrConnectWithoutUserInput = {
    where: reportsWhereUniqueInput
    create: XOR<reportsCreateWithoutUserInput, reportsUncheckedCreateWithoutUserInput>
  }

  export type reportsCreateManyUserInputEnvelope = {
    data: reportsCreateManyUserInput | reportsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type prescriptionsCreateWithoutUserInput = {
    id?: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
    medicines?: medicinesCreateNestedManyWithoutPrescriptionInput
  }

  export type prescriptionsUncheckedCreateWithoutUserInput = {
    id?: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
    medicines?: medicinesUncheckedCreateNestedManyWithoutPrescriptionInput
  }

  export type prescriptionsCreateOrConnectWithoutUserInput = {
    where: prescriptionsWhereUniqueInput
    create: XOR<prescriptionsCreateWithoutUserInput, prescriptionsUncheckedCreateWithoutUserInput>
  }

  export type prescriptionsCreateManyUserInputEnvelope = {
    data: prescriptionsCreateManyUserInput | prescriptionsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type chat_historyCreateWithoutUserInput = {
    id?: string
    user_message?: string | null
    ai_response?: string | null
    created_at?: Date | string
  }

  export type chat_historyUncheckedCreateWithoutUserInput = {
    id?: string
    user_message?: string | null
    ai_response?: string | null
    created_at?: Date | string
  }

  export type chat_historyCreateOrConnectWithoutUserInput = {
    where: chat_historyWhereUniqueInput
    create: XOR<chat_historyCreateWithoutUserInput, chat_historyUncheckedCreateWithoutUserInput>
  }

  export type chat_historyCreateManyUserInputEnvelope = {
    data: chat_historyCreateManyUserInput | chat_historyCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type reportsUpsertWithWhereUniqueWithoutUserInput = {
    where: reportsWhereUniqueInput
    update: XOR<reportsUpdateWithoutUserInput, reportsUncheckedUpdateWithoutUserInput>
    create: XOR<reportsCreateWithoutUserInput, reportsUncheckedCreateWithoutUserInput>
  }

  export type reportsUpdateWithWhereUniqueWithoutUserInput = {
    where: reportsWhereUniqueInput
    data: XOR<reportsUpdateWithoutUserInput, reportsUncheckedUpdateWithoutUserInput>
  }

  export type reportsUpdateManyWithWhereWithoutUserInput = {
    where: reportsScalarWhereInput
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyWithoutUserInput>
  }

  export type reportsScalarWhereInput = {
    AND?: reportsScalarWhereInput | reportsScalarWhereInput[]
    OR?: reportsScalarWhereInput[]
    NOT?: reportsScalarWhereInput | reportsScalarWhereInput[]
    id?: UuidFilter<"reports"> | string
    user_id?: UuidFilter<"reports"> | string
    file_url?: StringFilter<"reports"> | string
    report_name?: StringNullableFilter<"reports"> | string | null
    summary?: StringNullableFilter<"reports"> | string | null
    created_at?: DateTimeFilter<"reports"> | Date | string
  }

  export type prescriptionsUpsertWithWhereUniqueWithoutUserInput = {
    where: prescriptionsWhereUniqueInput
    update: XOR<prescriptionsUpdateWithoutUserInput, prescriptionsUncheckedUpdateWithoutUserInput>
    create: XOR<prescriptionsCreateWithoutUserInput, prescriptionsUncheckedCreateWithoutUserInput>
  }

  export type prescriptionsUpdateWithWhereUniqueWithoutUserInput = {
    where: prescriptionsWhereUniqueInput
    data: XOR<prescriptionsUpdateWithoutUserInput, prescriptionsUncheckedUpdateWithoutUserInput>
  }

  export type prescriptionsUpdateManyWithWhereWithoutUserInput = {
    where: prescriptionsScalarWhereInput
    data: XOR<prescriptionsUpdateManyMutationInput, prescriptionsUncheckedUpdateManyWithoutUserInput>
  }

  export type prescriptionsScalarWhereInput = {
    AND?: prescriptionsScalarWhereInput | prescriptionsScalarWhereInput[]
    OR?: prescriptionsScalarWhereInput[]
    NOT?: prescriptionsScalarWhereInput | prescriptionsScalarWhereInput[]
    id?: UuidFilter<"prescriptions"> | string
    user_id?: UuidFilter<"prescriptions"> | string
    file_url?: StringFilter<"prescriptions"> | string
    extracted_text?: StringNullableFilter<"prescriptions"> | string | null
    created_at?: DateTimeFilter<"prescriptions"> | Date | string
  }

  export type chat_historyUpsertWithWhereUniqueWithoutUserInput = {
    where: chat_historyWhereUniqueInput
    update: XOR<chat_historyUpdateWithoutUserInput, chat_historyUncheckedUpdateWithoutUserInput>
    create: XOR<chat_historyCreateWithoutUserInput, chat_historyUncheckedCreateWithoutUserInput>
  }

  export type chat_historyUpdateWithWhereUniqueWithoutUserInput = {
    where: chat_historyWhereUniqueInput
    data: XOR<chat_historyUpdateWithoutUserInput, chat_historyUncheckedUpdateWithoutUserInput>
  }

  export type chat_historyUpdateManyWithWhereWithoutUserInput = {
    where: chat_historyScalarWhereInput
    data: XOR<chat_historyUpdateManyMutationInput, chat_historyUncheckedUpdateManyWithoutUserInput>
  }

  export type chat_historyScalarWhereInput = {
    AND?: chat_historyScalarWhereInput | chat_historyScalarWhereInput[]
    OR?: chat_historyScalarWhereInput[]
    NOT?: chat_historyScalarWhereInput | chat_historyScalarWhereInput[]
    id?: UuidFilter<"chat_history"> | string
    user_id?: UuidFilter<"chat_history"> | string
    user_message?: StringNullableFilter<"chat_history"> | string | null
    ai_response?: StringNullableFilter<"chat_history"> | string | null
    created_at?: DateTimeFilter<"chat_history"> | Date | string
  }

  export type usersCreateWithoutReportsInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    prescriptions?: prescriptionsCreateNestedManyWithoutUserInput
    chat_history?: chat_historyCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutReportsInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    prescriptions?: prescriptionsUncheckedCreateNestedManyWithoutUserInput
    chat_history?: chat_historyUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutReportsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
  }

  export type health_metricsCreateWithoutReportInput = {
    id?: string
    metric_name?: string | null
    metric_value?: string | null
    status?: string | null
    explanation?: string | null
    created_at?: Date | string
  }

  export type health_metricsUncheckedCreateWithoutReportInput = {
    id?: string
    metric_name?: string | null
    metric_value?: string | null
    status?: string | null
    explanation?: string | null
    created_at?: Date | string
  }

  export type health_metricsCreateOrConnectWithoutReportInput = {
    where: health_metricsWhereUniqueInput
    create: XOR<health_metricsCreateWithoutReportInput, health_metricsUncheckedCreateWithoutReportInput>
  }

  export type health_metricsCreateManyReportInputEnvelope = {
    data: health_metricsCreateManyReportInput | health_metricsCreateManyReportInput[]
    skipDuplicates?: boolean
  }

  export type usersUpsertWithoutReportsInput = {
    update: XOR<usersUpdateWithoutReportsInput, usersUncheckedUpdateWithoutReportsInput>
    create: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutReportsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutReportsInput, usersUncheckedUpdateWithoutReportsInput>
  }

  export type usersUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prescriptions?: prescriptionsUpdateManyWithoutUserNestedInput
    chat_history?: chat_historyUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prescriptions?: prescriptionsUncheckedUpdateManyWithoutUserNestedInput
    chat_history?: chat_historyUncheckedUpdateManyWithoutUserNestedInput
  }

  export type health_metricsUpsertWithWhereUniqueWithoutReportInput = {
    where: health_metricsWhereUniqueInput
    update: XOR<health_metricsUpdateWithoutReportInput, health_metricsUncheckedUpdateWithoutReportInput>
    create: XOR<health_metricsCreateWithoutReportInput, health_metricsUncheckedCreateWithoutReportInput>
  }

  export type health_metricsUpdateWithWhereUniqueWithoutReportInput = {
    where: health_metricsWhereUniqueInput
    data: XOR<health_metricsUpdateWithoutReportInput, health_metricsUncheckedUpdateWithoutReportInput>
  }

  export type health_metricsUpdateManyWithWhereWithoutReportInput = {
    where: health_metricsScalarWhereInput
    data: XOR<health_metricsUpdateManyMutationInput, health_metricsUncheckedUpdateManyWithoutReportInput>
  }

  export type health_metricsScalarWhereInput = {
    AND?: health_metricsScalarWhereInput | health_metricsScalarWhereInput[]
    OR?: health_metricsScalarWhereInput[]
    NOT?: health_metricsScalarWhereInput | health_metricsScalarWhereInput[]
    id?: UuidFilter<"health_metrics"> | string
    report_id?: UuidFilter<"health_metrics"> | string
    metric_name?: StringNullableFilter<"health_metrics"> | string | null
    metric_value?: StringNullableFilter<"health_metrics"> | string | null
    status?: StringNullableFilter<"health_metrics"> | string | null
    explanation?: StringNullableFilter<"health_metrics"> | string | null
    created_at?: DateTimeFilter<"health_metrics"> | Date | string
  }

  export type reportsCreateWithoutHealth_metricsInput = {
    id?: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
    user: usersCreateNestedOneWithoutReportsInput
  }

  export type reportsUncheckedCreateWithoutHealth_metricsInput = {
    id?: string
    user_id: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
  }

  export type reportsCreateOrConnectWithoutHealth_metricsInput = {
    where: reportsWhereUniqueInput
    create: XOR<reportsCreateWithoutHealth_metricsInput, reportsUncheckedCreateWithoutHealth_metricsInput>
  }

  export type reportsUpsertWithoutHealth_metricsInput = {
    update: XOR<reportsUpdateWithoutHealth_metricsInput, reportsUncheckedUpdateWithoutHealth_metricsInput>
    create: XOR<reportsCreateWithoutHealth_metricsInput, reportsUncheckedCreateWithoutHealth_metricsInput>
    where?: reportsWhereInput
  }

  export type reportsUpdateToOneWithWhereWithoutHealth_metricsInput = {
    where?: reportsWhereInput
    data: XOR<reportsUpdateWithoutHealth_metricsInput, reportsUncheckedUpdateWithoutHealth_metricsInput>
  }

  export type reportsUpdateWithoutHealth_metricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutReportsNestedInput
  }

  export type reportsUncheckedUpdateWithoutHealth_metricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateWithoutPrescriptionsInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    reports?: reportsCreateNestedManyWithoutUserInput
    chat_history?: chat_historyCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutPrescriptionsInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    reports?: reportsUncheckedCreateNestedManyWithoutUserInput
    chat_history?: chat_historyUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutPrescriptionsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutPrescriptionsInput, usersUncheckedCreateWithoutPrescriptionsInput>
  }

  export type medicinesCreateWithoutPrescriptionInput = {
    id?: string
    medicine_name?: string | null
    usage_info?: string | null
    dosage_info?: string | null
    side_effects?: string | null
  }

  export type medicinesUncheckedCreateWithoutPrescriptionInput = {
    id?: string
    medicine_name?: string | null
    usage_info?: string | null
    dosage_info?: string | null
    side_effects?: string | null
  }

  export type medicinesCreateOrConnectWithoutPrescriptionInput = {
    where: medicinesWhereUniqueInput
    create: XOR<medicinesCreateWithoutPrescriptionInput, medicinesUncheckedCreateWithoutPrescriptionInput>
  }

  export type medicinesCreateManyPrescriptionInputEnvelope = {
    data: medicinesCreateManyPrescriptionInput | medicinesCreateManyPrescriptionInput[]
    skipDuplicates?: boolean
  }

  export type usersUpsertWithoutPrescriptionsInput = {
    update: XOR<usersUpdateWithoutPrescriptionsInput, usersUncheckedUpdateWithoutPrescriptionsInput>
    create: XOR<usersCreateWithoutPrescriptionsInput, usersUncheckedCreateWithoutPrescriptionsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutPrescriptionsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutPrescriptionsInput, usersUncheckedUpdateWithoutPrescriptionsInput>
  }

  export type usersUpdateWithoutPrescriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUpdateManyWithoutUserNestedInput
    chat_history?: chat_historyUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutPrescriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUncheckedUpdateManyWithoutUserNestedInput
    chat_history?: chat_historyUncheckedUpdateManyWithoutUserNestedInput
  }

  export type medicinesUpsertWithWhereUniqueWithoutPrescriptionInput = {
    where: medicinesWhereUniqueInput
    update: XOR<medicinesUpdateWithoutPrescriptionInput, medicinesUncheckedUpdateWithoutPrescriptionInput>
    create: XOR<medicinesCreateWithoutPrescriptionInput, medicinesUncheckedCreateWithoutPrescriptionInput>
  }

  export type medicinesUpdateWithWhereUniqueWithoutPrescriptionInput = {
    where: medicinesWhereUniqueInput
    data: XOR<medicinesUpdateWithoutPrescriptionInput, medicinesUncheckedUpdateWithoutPrescriptionInput>
  }

  export type medicinesUpdateManyWithWhereWithoutPrescriptionInput = {
    where: medicinesScalarWhereInput
    data: XOR<medicinesUpdateManyMutationInput, medicinesUncheckedUpdateManyWithoutPrescriptionInput>
  }

  export type medicinesScalarWhereInput = {
    AND?: medicinesScalarWhereInput | medicinesScalarWhereInput[]
    OR?: medicinesScalarWhereInput[]
    NOT?: medicinesScalarWhereInput | medicinesScalarWhereInput[]
    id?: UuidFilter<"medicines"> | string
    prescription_id?: UuidFilter<"medicines"> | string
    medicine_name?: StringNullableFilter<"medicines"> | string | null
    usage_info?: StringNullableFilter<"medicines"> | string | null
    dosage_info?: StringNullableFilter<"medicines"> | string | null
    side_effects?: StringNullableFilter<"medicines"> | string | null
  }

  export type prescriptionsCreateWithoutMedicinesInput = {
    id?: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
    user: usersCreateNestedOneWithoutPrescriptionsInput
  }

  export type prescriptionsUncheckedCreateWithoutMedicinesInput = {
    id?: string
    user_id: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
  }

  export type prescriptionsCreateOrConnectWithoutMedicinesInput = {
    where: prescriptionsWhereUniqueInput
    create: XOR<prescriptionsCreateWithoutMedicinesInput, prescriptionsUncheckedCreateWithoutMedicinesInput>
  }

  export type prescriptionsUpsertWithoutMedicinesInput = {
    update: XOR<prescriptionsUpdateWithoutMedicinesInput, prescriptionsUncheckedUpdateWithoutMedicinesInput>
    create: XOR<prescriptionsCreateWithoutMedicinesInput, prescriptionsUncheckedCreateWithoutMedicinesInput>
    where?: prescriptionsWhereInput
  }

  export type prescriptionsUpdateToOneWithWhereWithoutMedicinesInput = {
    where?: prescriptionsWhereInput
    data: XOR<prescriptionsUpdateWithoutMedicinesInput, prescriptionsUncheckedUpdateWithoutMedicinesInput>
  }

  export type prescriptionsUpdateWithoutMedicinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: usersUpdateOneRequiredWithoutPrescriptionsNestedInput
  }

  export type prescriptionsUncheckedUpdateWithoutMedicinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateWithoutChat_historyInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    reports?: reportsCreateNestedManyWithoutUserInput
    prescriptions?: prescriptionsCreateNestedManyWithoutUserInput
  }

  export type usersUncheckedCreateWithoutChat_historyInput = {
    id?: string
    name: string
    email: string
    password: string
    created_at?: Date | string
    reports?: reportsUncheckedCreateNestedManyWithoutUserInput
    prescriptions?: prescriptionsUncheckedCreateNestedManyWithoutUserInput
  }

  export type usersCreateOrConnectWithoutChat_historyInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutChat_historyInput, usersUncheckedCreateWithoutChat_historyInput>
  }

  export type usersUpsertWithoutChat_historyInput = {
    update: XOR<usersUpdateWithoutChat_historyInput, usersUncheckedUpdateWithoutChat_historyInput>
    create: XOR<usersCreateWithoutChat_historyInput, usersUncheckedCreateWithoutChat_historyInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutChat_historyInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutChat_historyInput, usersUncheckedUpdateWithoutChat_historyInput>
  }

  export type usersUpdateWithoutChat_historyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUpdateManyWithoutUserNestedInput
    prescriptions?: prescriptionsUpdateManyWithoutUserNestedInput
  }

  export type usersUncheckedUpdateWithoutChat_historyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUncheckedUpdateManyWithoutUserNestedInput
    prescriptions?: prescriptionsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type reportsCreateManyUserInput = {
    id?: string
    file_url: string
    report_name?: string | null
    summary?: string | null
    created_at?: Date | string
  }

  export type prescriptionsCreateManyUserInput = {
    id?: string
    file_url: string
    extracted_text?: string | null
    created_at?: Date | string
  }

  export type chat_historyCreateManyUserInput = {
    id?: string
    user_message?: string | null
    ai_response?: string | null
    created_at?: Date | string
  }

  export type reportsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    health_metrics?: health_metricsUpdateManyWithoutReportNestedInput
  }

  export type reportsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    health_metrics?: health_metricsUncheckedUpdateManyWithoutReportNestedInput
  }

  export type reportsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    report_name?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type prescriptionsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    medicines?: medicinesUpdateManyWithoutPrescriptionNestedInput
  }

  export type prescriptionsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    medicines?: medicinesUncheckedUpdateManyWithoutPrescriptionNestedInput
  }

  export type prescriptionsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_url?: StringFieldUpdateOperationsInput | string
    extracted_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chat_historyUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chat_historyUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type chat_historyUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_message?: NullableStringFieldUpdateOperationsInput | string | null
    ai_response?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type health_metricsCreateManyReportInput = {
    id?: string
    metric_name?: string | null
    metric_value?: string | null
    status?: string | null
    explanation?: string | null
    created_at?: Date | string
  }

  export type health_metricsUpdateWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type health_metricsUncheckedUpdateWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type health_metricsUncheckedUpdateManyWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    metric_name?: NullableStringFieldUpdateOperationsInput | string | null
    metric_value?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type medicinesCreateManyPrescriptionInput = {
    id?: string
    medicine_name?: string | null
    usage_info?: string | null
    dosage_info?: string | null
    side_effects?: string | null
  }

  export type medicinesUpdateWithoutPrescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type medicinesUncheckedUpdateWithoutPrescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type medicinesUncheckedUpdateManyWithoutPrescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    medicine_name?: NullableStringFieldUpdateOperationsInput | string | null
    usage_info?: NullableStringFieldUpdateOperationsInput | string | null
    dosage_info?: NullableStringFieldUpdateOperationsInput | string | null
    side_effects?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}