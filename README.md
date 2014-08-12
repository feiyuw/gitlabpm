# gitlabpm - a scrum project management tool based on gitlab

The development of my team has been switched to gitlab, but the management is a problem. We created a markdown document to update the issue status and assigner, but as we use SCRUM process, the document need to update every day, and this is a waste of work.

Based on this issue, I decided to create this tool, it want to solve:

1. As a manager, I want to know how many issues are open in all of my projects
1. As a manager, I want to know how many issues are ongoing in all of my projects
1. As a manager, I want to know the assigner of each ongoing issue
1. As a manager, I want to know the issues of each sprint
1. As a manager, I want to know the effort of each issue
1. As a manager, I want to know the priority of issues of one sprint
1. As a developer, I want to create a merge request based on issues
1. As a developer, I want to the issues created automatically when I close their merge request
1. As a developer, I want to move one issue from A project to B project
1. As a developer, I want gitlab will send the review request email to the key reviewers when the merge request has been created and PASS CCI
1. As a developer, I want merge request closed automatically when over 2 key reviewers marked +1 and CCI passed
1. As a developer, I want to define key reviewers of my merge request, project owners should be key reviewers
1. As a developer, I want to know the CCI result of my merge request

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
