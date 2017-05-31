"use strict;"

const GITHUB_URL = 'https://api.github.com';
var fetch = require('node-fetch');
var gitHubToken = '';

function setToken(token) {
    gitHubToken = token;
}

function fetchGitHub(url) {
  return fetch(GITHUB_URL + url, {headers: {'Authorization': 'token ' + gitHubToken}})
    .then(res => {
      console.log('Fetched: ' + url);
      return res;
    })
    .then(res => res.json());
}

function fetchUser(login) {
  return fetchGitHub('/users/' + login);
}

function fetchFollower(login) {
  return fetchGitHub('/users/' + login + '/followers')
    .then(followers => followers.map(follower => fetchUser(follower.login)));
}

function fetchFollowing(login) {
  return fetchGitHub('/users/' + login + '/following')
    .then(followings => followings.map(following => fetchUser(following.login)));
}

function fetchReposOfUser(login) {
  return fetchGitHub('/users/' + login + '/repos');
}

class GitHubUser {}
class GitHubRepository {}

module.exports = {
  getGitHubUser: (login) => fetchUser(login), 
  getGitHubRepositories: (login) => fetchReposOfUser(login),
  getGitHubFollower: (login) => fetchFollower(login),
  getGitHubFollowings: (login) => fetchFollowing(login),
  setToken: setToken,
  GitHubUser,
  GitHubRepository
};
