## Setup

### Local domain

Add local domain to file `/etc/hosts`

```text
## POC universal login
127.0.0.1 a.beepit.loc
127.0.0.1 b.beepit.loc
127.0.0.1 www.beepit.loc
```

### Nginx

Install Nginx on MacOS

```
brew install nginx 
```

Back up old `nginx.conf` in dir `/usr/local/etc/nginx`

```
cd /usr/local/etc/nginx
cp nginx.conf nginx.conf.orig
chmod a-w nginx.conf.orig
```

Setup Nginx by replacing `nginx.conf` with `nginx/nginx.conf` of project.

```
cp nginx/nginx.conf /usr/local/etc/nginx/nginx.conf
```

Start Nginx or Reload if it's already started

```
# if nginx not started, then start it
nginx

# if nginx has been started, then reload new config
nginx -s reload
```

### Redis

Install Redis on MacOS

```
brew install redis
```

Startup redis on port `6379` (default port)

```
redis
```

> You can use an opensource Redis manage tool [*medis*](http://getmedis.com/), downloads from http://getmedis.com/.

### Project

```
yarn install
```

## Startup

Startup server

```
yarn dev
```

Check result by visiting

- http://a.beepit.loc
- http://b.beepit.loc

If login within any of the domain, then it works between domains.

> Notice that, example session maxAge=15 seconds.

## FAQ

### cookie-parser middleware is dangerous

for ExpressJS, Since version 1.5.0, the [*cookie-parser middleware*](https://www.npmjs.com/package/cookie-parser) no longer needs to be used for this module to work. This module now directly reads and writes cookies on `req`/`res`. Using `cookie-parser` may result in issues if the `secret` is not the same between this module and `cookie-parser`.
               
This example doesn't use *cookie-parser middleware*
