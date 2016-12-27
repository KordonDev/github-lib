"use strict;"

const GITHUB_URL = 'https://api.github.com';

var fetch = require('node-fetch');
var storage = require('node-persist');
var storageOptions = {dir: './cache.file'};
storage.init(storageOptions)
    .then(() => storage.clear())
    .then(() => console.log('Cache setup'))
    .catch((err) => console.error(err));
var gitHubToken = '';

function setToken(token) {
    gitHubToken = token;
}

function fetchGitHub(url) {
    return storage.getItem(url)
        .then(value => {
            if (value) {
                return value;
            }
            return fetch(GITHUB_URL + url, {headers: {'Authorization': 'token ' + gitHubToken}})
               .then(res => {
                  console.log('fetched:', res.url);
                   let json = res.json();
                   storage.setItem(url, json);
                  return json;
                });
        }
 );
}

function fetchUser(login) {
  return fetchGitHub('/users/' + login);
}

function fetchFollower(login) {
  return fetchGitHub('/users/' + login + '/followers');
}

function fetchFollowing(login) {
  return fetchGitHub('/users/' + login + '/following');
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
