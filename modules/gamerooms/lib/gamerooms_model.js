/**
 * GameRooms
 *    _id
 *    title               Webs torm 1년 계정 추첨
 *
 *    host
 *      _id
 *      username
 *      profile_url
 *
 *    connections: [
 *                   _id
 *                   username
 *                   profile_url
 *                  ,
 *                   _id
 *                   username
 *                   profile_url
 *                 ]
 *    state               { READY, START }
 *    createdAt           Date
 *
 */

Gamerooms = new Mongo.Collection('gamerooms');

