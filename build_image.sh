DOCKER_PASSWORD=oqOTmMOfl3SfsApQ
DOCKER_USERNAME=aiphsn
DOCKER_REGISTRY=registry.cn-qingdao.aliyuncs.com

echo $DOCKER_PASSWORD | docker login $DOCKER_REGISTRY -u $DOCKER_USERNAME --password-stdin

VERSION="1.0"
BETA=$(date +%s)
echo "current version: [$VERSION] [$BETA]"

docker build . -t $DOCKER_REGISTRY/aiphsn/animaladminweb:v$VERSION-$BETA
docker push $DOCKER_REGISTRY/aiphsn/animaladminweb:v$VERSION-$BETA
docker rmi $DOCKER_REGISTRY/aiphsn/animaladminweb:v$VERSION-$BETA
