This is a test of creating an http proxy into a hypertele style proxy

THe goal here is this

web => hyper-http-proxy => hypertele-server => http server

Yeah, its a lot of proxies in the middle, but it opens up a lot of neat things. 

I have a different use case then presented here, but I am stuck getting the streams to work properly

getting started
---------------

```
git clone https://github.com/ryanramage/hyper-http-proxy.git
cd hyper-http-proxy
npm i
```

Start a fake http server. this will serve on port 8080 in the public dir

```
> npx http-server
```

Now lets create a hypertele style proxy to the above to p2p 

```
> hypertele-server -l 8080 --cert-skip --seed 8f05c5850badc62b7da53e65a66a7b257ef4efaa120d993cefa0525fb1e6b3f4
hypertele: 40ee7682aa99f2eca43e3d098a54f1c6e29c2c68e43de5166755bc1f1757b7f7

```

Ok we are ready to make an http proxy into the p2p 


```
> node index.js 40ee7682aa99f2eca43e3d098a54f1c6e29c2c68e43de5166755bc1f1757b7f7
http proxy server listening on port: 8000
proxy to:  40ee7682aa99f2eca43e3d098a54f1c6e29c2c68e43de5166755bc1f1757b7f7
```


Now call the hyper-http-proxy

```
curl localhost:8000/pokedex.json
```

Its now all working, but we use a hacky way to know the server secret stream is done.

