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
 *                  ,
 *                   _id
 *                   username
 *                 ]
 *    state               { READY, START }
 *    createdAt           Date
 *
 */

GameRooms = new Mongo.Collection('gamerooms');

