#!/bin/bash

nohup ./bin/www 3001 > gitlabpm.3001.log 2>&1 &
unset http_proxy
wget http://localhost:3001/issues/
wget http://localhost:3001/sprints/
