const { Model } = require('objection');
const knex = require('./knex');

Model.knex(knex); // Give the knex object to objection.

class Base extends Model {
    static get useLimitInFirst() { // check docs
        return true;
    }


    $beforeUpdate() {
        this.updated_at = new Date().toISOString();
    }

    static async all() {
        return this.query();
    }

    static async find(id) {
        return this.query().findById(id);
    }

    static async findBy(fieldName, value) {
        return this.query().where(fieldName, '=', value).first();
    }

    static async findAllBy(fieldName, value) {
        return this.query().where(fieldName, '=', value);
    }

    // obj or array
    static async create(itemOrItemsToCreate) {
        return this.query().insertGraph(itemOrItemsToCreate);
    }

    async addRelations(relationName, relationObjOrObjs) {
        return this.$relatedQuery(relationName).relate(relationObjOrObjs.id);
    }

    async relations(relationName) {
        return this.$relatedQuery(relationName);
    }
}

module.exports = Base;
