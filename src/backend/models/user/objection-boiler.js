const Path = require('path');
const { Model } = require('objection');
const Base = require('../base');

class ObjectionBoiler extends Base {
    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                created_at: { type: 'date' },
                updated_at: { type: 'date' },
            },
        };
    }

    // not needed in this simple app, but here it is as a refresher!
    // static get relationMappings() {
    //     return {
    //         articles: {
    //             relation: Model.HasManyRelation,
    //             modelClass: Path.join(__dirname, '..', 'article'),
    //             join: {
    //                 from: 'users.id',
    //                 to: 'articles.user_id',
    //             },
    //         },
    //     };
    // }
}

module.exports = ObjectionBoiler;
