import elasticsearchClient from "./src/utils/elasticsearch";

elasticsearchClient.cluster.health({},function(err,resp,status) {
    console.log("-- Client Health --",resp);
});