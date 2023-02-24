const elasticsearch = require('elasticsearch');

const elasticsearchClient = new elasticsearch.Client({
    hosts: [
        'http://103.226.249.176/9200'
    ]
});

export default elasticsearchClient;