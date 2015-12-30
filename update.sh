#!/bin/bash
# Update local machine

echo “Starting meteor build to local machine 正在更新本地服务器..”

echo “getting latest code 正在更新代码..”
git pull

echo “building meteor bundle 正在建设代码..”
meteor build --architecture=os.linux.x86_64 ./

mv *.tar.gz ~/app/wordparser.tar.gz

echo “restart meteor.. 正在重启服务..”
docker restart meteor