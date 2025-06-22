export default {
  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  |
  | Here you may define the authentication guards and providers for your
  | application. You can create multiple guards and providers as needed.
  |
  */

  guard: 'web',

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  |
  | Guards define how users are authenticated for each request. 
  | You can define multiple guards for different types of users.
  |
  */

  guards: {
    web: {
      driver: 'session',
      provider: 'users',
    },
    api: {
      driver: 'token',
      provider: 'users',
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  |
  | Providers define how users are retrieved from your database or other
  | storage mechanisms used by your application.
  |
  */

  providers: {
    users: {
      driver: 'lucid',
      model: 'App/Models/User',
    },
  },
}
