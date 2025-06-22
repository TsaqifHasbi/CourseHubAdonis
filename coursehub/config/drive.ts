import Drive from '@ioc:Adonis/Core/Drive'

export default Drive.configure({
  driver: 'local',
  root: 'public/uploads',
  visibility: 'public',
})
