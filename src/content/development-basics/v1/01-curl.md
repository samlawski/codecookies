---
title: cURL
description: Learn to make requests to servers and APIs using the command line.
slug: curl
videoId: rvQmSuPq-D4
lastUpdate: March 16th, 2022
---

With cURL, you can make HTTP requests to APIs, backends, or simply URLs from the command line. 

The basic commands are:

- `curl https://v2.jokeapi.dev/joke/programming` - make a simple GET request
- `curl google.com  -L` - short for `--location` returns the response after any redirects
- `curl https://reqres.in/api/users -d "page=2"` - short for `--data` adds data parameters
- `curl https://reqres.in/api/users -X POST` - short for `--request` defines the HTTP method to use; in this case it's `POST`
- `curl https://reqres.in/api/users -H 'Key: Value'` - short for `--header` sets an additional key-value pair in the header