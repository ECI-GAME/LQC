# LQC


### DEV

**Hosts**
```
127.0.0.1 lqc.ecigames.buzz
```

**Nginx**
```
server {
    listen 80;
    server_name lqc.ecigames.buzz;

    proxy_set_header        Host $host;
    proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;

    location / {
        proxy_pass http://127.0.0.1:9090;
    }
}
```


