# shadowsocks
!> 需要准备一台能访问外网的服务器。

1. 安装pip和shadowsocks服务

```
yum install python-pip
pip install shadowsocks
```

2. 创建配置文件，这里以`/etc/shadowsocks/ss_etc.json`为例，文件内容为下
> 只需要修改端口号和密码。

单一端口
```json
  {
    "server": "0.0.0.0",
    "server_port": 端口号,           
    "local_address":"127.0.0.1",
    "local_port": 1080,
    "password": "密码",
    "timeout": 300,
    "method": "aes-256-cfb",
    "fast_open":false,
    "workers": 1
}
```
多端口
```json
{
    "server":"0.0.0.0",
    "local_address":"127.0.0.1",
    "local_port":1080,
    "port_password":{           // 每个端口对应一个密码
        "端口1": "密码1",
        "端口2": "密码2",
        "端口3": "密码3"
    },
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open":false
}
```

3. 启动shadowsocks服务

```
// 启动
ssserver -c /etc/shadowsocks/ss_etc.json -d start

// 停止
ssserver -c /etc/shadowsocks/ss_etc.json -d stop

// 重启
ssserver -c /etc/shadowsocks/ss_etc.json -d restart
```