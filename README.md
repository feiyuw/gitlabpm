# gitlabpm - a scrum project management tool based on gitlab

[![Build Status](https://travis-ci.org/feiyuw/gitlabpm.svg?branch=master)](https://travis-ci.org/feiyuw/gitlabpm)
[![Codeship Status for feiyuw/gitlabpm](https://www.codeship.io/projects/fb188f80-0411-0132-4808-06cd9fe8c123/status)](https://www.codeship.io/projects/30580)

The development of my team has been switched to gitlab, but the management is a problem. We created a markdown document to update the issue status and assigner, but as we use SCRUM process, the document need to update every day, and this is a waste of work.

Based on this issue, I decided to create this tool. Current version is v0.1, it includes the following features:

1. As a manager, I want to know how many issues are open in all of my projects
1. As a manager, I want to know how many issues are ongoing in all of my projects
1. As a manager, I want to know the assigner of each ongoing issue
1. As a manager, I want to know the issues of each sprint
1. As a manager, I want to know the priority of issues of one sprint

## Overview

I don't want to store the data of gitlab related issues/projects/merge requests, gitlabpm will not have persistent storage, but only runtime cache. All the data are stored in gitlab itself. As gitlab provides good interfaces including web-hooks and API, I will use them.

And gitlabpm itself will use node.js, which I'm studying it right now.

## Architecture

TODO

## Instruction

TODO

## TODO

TODO

## Reference

1. web-hooks    http://demo.gitlab.com/help/web_hooks/web_hooks.md
1. API          http://demo.gitlab.com/help/api/README.md
