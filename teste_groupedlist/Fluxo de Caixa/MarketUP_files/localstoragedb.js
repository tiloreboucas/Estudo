/*
Kailash Nadh (http://kailashnadh.name)
	
localStorageDB
September 2011
A simple database layer for localStorage

License	:	MIT License
*/
var ProductsBlob = null;

function localStorageDB(pDb, pTable) {
    var _instance = this;

    var db_prefix = 'db_',
        db_name = pDb,
        table_name = pTable,
		db_id = db_prefix + db_name,
		db_new = false, // this flag determines whether a new database was created during an object initialisation
		db = null,
        path = "C\\IVX\\" + ClientId + '\\' + db_id + "\\",
        bProduct = (table_name == ClientId + "_item_pdv_Off");

    function Init(callback) {

        db = null;

        if (bProduct && ProductsBlob) {
            db = JSON.parse(ProductsBlob);
            callback(_instance);
        } else {

            //Try to read the database file
            var ofx = new OmegaFile();
            ofx.ReadFile(path + table_name + ".ivx", function (bd_data) {
                //Check if db exists an decrypt
                if ((bd_data) && (!bd_data.code)) {
                    bd_data = JSON.parse(bd_data);
                    db = sjcl.decrypt(String(db_id + path), bd_data);
                    //Products Cache
                    if (bProduct && (!ProductsBlob)) ProductsBlob = db.toString();
                    db = JSON.parse(db);
                }

                //Check if is a valid database
                if (!(db && (db.tables && db.data))) {

                    if (bProduct) ProductsBlob = null;
                    //Check database name
                    if (!validateName(db_name)) {
                        error("The name '" + db_name + "'" + " contains invalid characters.");
                        //Valid name and database doesnt exists, create it    
                    } else {
                        db = { tables: {}, data: {} };
                        db_new = true;
                        commit(callback);
                        ofx = null;
                    }
                } else {
                    callback(_instance);
                    ofx = null;

                }

            });
        }
    }

    // ______________________ private methods

    // _________ database functions
    // drop the database
    function drop(callback) {
        db = null;
        var ofx = new OmegaFile();
        ofx.ClearDirectory(path, callback);

    }

    // number of tables in the database
    function tableCount() {
        var count = 0;
        for (var table in db.tables) {
            if (db.tables.hasOwnProperty(table)) {
                count++;
            }
        }
        return count;
    }

    // _________ table functions

    // check whether a table exists
    function tableExists(table_name) {
        return db.tables[table_name] ? true : false;
    }

    // check whether a table exists, and if not, throw an error
    function tableExistsWarn(table_name) {
        if (!tableExists(table_name)) {
            error("The table '" + table_name + "' does not exist.");
        }
    }

    // create a table
    function createTable(table_name, fields) {
        db.tables[table_name] = { fields: fields, auto_increment: 1 };
        db.data[table_name] = {};
    }

    // drop a table
    function dropTable(table_name) {
        delete db.tables[table_name];
        delete db.data[table_name];
    }

    // empty a table
    function truncate(table_name) {
        db.tables[table_name].auto_increment = 1;
        db.data[table_name] = {};
    }

    // number of rows in a table
    function rowCount(table_name) {
        var count = 0;
        for (var ID in db.data[table_name]) {
            if (db.data[table_name].hasOwnProperty(ID)) {
                count++;
            }
        }
        return count;
    }

    // insert a new row
    function insert(table_name, data) {
        data.ID = db.tables[table_name].auto_increment;
        db.data[table_name][db.tables[table_name].auto_increment] = data;
        db.tables[table_name].auto_increment++;
        return data.ID;
    }

    // select rows, given a list of IDs of rows in a table
    function select(table_name, ids) {
        var ID = null, results = [], row = null;
        for (var i = 0; i < ids.length; i++) {
            ID = ids[i];
            row = db.data[table_name][ID];
            results.push(clone(row));
        }
        return results;
    }

    // select rows in a table by field-value pairs, returns the IDs of matches
    function queryByValues(table_name, data, limit) {

//        var tmp_results = "";
//        var rx = null;
//        var search_result = JSON.stringify(db);
//        var data = validFields(table_name, parameters);

//        var search_value = '';
//        var l_like = '';
//        var r_like = '';

//        for (var field in data) {

//            if (typeof data[field] == 'string') {
//                search_value = data[field];

//                if ($.epar(search_value)) {
//                    l_like = (search_value.substr(0, 1) == '%' ? '[^"]*' : '');
//                    r_like = (search_value.substr((search_value.length - 1), 1) == '%' ? '[^"]*' : '');
//                } else {
//                    l_like = '';
//                    r_like = '';
//                }

//                rx = new RegExp('\{[^}]*"' + field + '":"' + l_like + data[field].replace(/\%/g, '') + r_like + '"[^}]*\}', 'gi'); 
//            } else {
//                rx = new RegExp('\{[^}]*"' + field + '":' + data[field] + '[^}]*\}', 'gi');
//            }

//            while (result = rx.exec(search_result)) { tmp_results += result[1] + '§'; }
//            search_result = tmp_results;
//            tmp_results = "";
//        }

//        if (search_result != '') {
//            var arrResults = [];
//            var arrTmp = [];

//            arrTmp = search_result.split('§');
//            arrTmp.pop();

//            for (var i = 0; i < arrTmp.length; i++) {
//                arrResults.push(eval('(' + arrTmp[i] + ')'));
//            }
//            return arrResults;
//        }

//        return [];

        var result_ids = [],
			exists = false,
			row = null;
        //console.log(table_name, data, limit);
        // loop through all the records in the table, looking for matches
        for (var ID in db.data[table_name]) {
            if (!db.data[table_name].hasOwnProperty(ID)) {
                continue;
            }

            row = db.data[table_name][ID];
            exists = true;

            for (var field in data) {
                if (!data.hasOwnProperty(field)) {
                    continue;
                }

                if (typeof data[field] == 'string') {	// if the field is a string, do a case insensitive comparison
                    if (data[field][0] == '%' || data[field][data[field].length - 1] == '%') {
                        if (data[field][0] == '%')
                            data[field] = data[field].substring(1, data[field].length);
                        if (data[field][data[field].length - 1] == '%')
                            data[field] = data[field].substring(0, data[field].length - 1);
                        if (row[field] == null || row[field].toString().toLowerCase().indexOf(data[field].toString().toLowerCase()) == -1) {
                            exists = false;
                            data[field] = '%' + data[field] + '%';
                            break;
                        }
                        data[field] = '%' + data[field] + '%';
                    }
                    else {
                        if (row[field] == null || row[field].toString().toLowerCase() != data[field].toString().toLowerCase()) {
                            exists = false;
                            break;
                        }
                    }
                } else {
                    if (row[field] != data[field]) {
                        exists = false;
                        break;
                    }
                }
            }
            if (exists) {
                result_ids.push(ID);
            }
            if (result_ids.length == limit) {
                break;
            }
        }
        return result_ids;
    }

    // select rows in a table by a function, returns the IDs of matches
    function queryByFunction(table_name, query_function, limit) {

        var result_ids = [],
			exists = false,
			row = null;

        // loop through all the records in the table, looking for matches
        for (var ID in db.data[table_name]) {
            if (!db.data[table_name].hasOwnProperty(ID)) {
                continue;
            }

            row = db.data[table_name][ID];

            if (query_function(clone(row)) == true) {	// it's a match if the supplied conditional function is satisfied
                result_ids.push(ID);
            }
            if (result_ids.length == limit) {
                break;
            }
        }
        return result_ids;
    }

    // select rows in a table by field-value pairs, returns the IDs of matches
    function queryByValuesFunction(table_name, data, query_function) {
        var result_rows = [],
            result_ids = [],
			exists = false,
			row = null;
        
        // loop through all the records in the table, looking for matches
        for (var ID in db.data[table_name]) {
            if (!db.data[table_name].hasOwnProperty(ID)) {
                continue;
            }

            row = db.data[table_name][ID];
            exists = true;

            for (var field in data) {

                if (!data.hasOwnProperty(field)) {
                    continue;
                }

                if (typeof data[field] == 'string') {	// if the field is a string, do a case insensitive comparison
                    if (data[field][0] == '%' || data[field][data[field].length - 1] == '%') {
                        if (data[field][0] == '%')
                            data[field] = data[field].substring(1, data[field].length);
                        if (data[field][data[field].length - 1] == '%')
                            data[field] = data[field].substring(0, data[field].length - 1);
                        if (row[field].toString().toLowerCase().indexOf(data[field].toString().toLowerCase()) == -1) {
                            exists = false;
                            data[field] = '%' + data[field] + '%';
                            break;
                        }
                        data[field] = '%' + data[field] + '%';
                    }
                    else {
                        if (row[field].toString().toLowerCase() != data[field].toString().toLowerCase()) {
                            exists = false;
                            break;
                        }
                    }
                } else {


                    if (row[field] != data[field]) {
                        exists = false;
                        break;
                    }
                }
            }
            if (exists) {
                result_rows.push(row);
            }
        }

        var i = 1;
        for (var x in result_rows) {
            result_rows[x].ID = i;
            i++;
        }

        // loop through all the records in the table, looking for matches
        for (var x in result_rows) {


            row = result_rows[x];

            if (query_function(clone(row)) == true) {	// it's a match if the supplied conditional function is satisfied
                result_ids.push(row.ID);
            }
        }

        return result_ids;
    }

    // return all the IDs in a table
    function getIDs(table_name, limit) {
        var result_ids = [];
        for (var ID in db.data[table_name]) {
            if (db.data[table_name].hasOwnProperty(ID)) {
                result_ids.push(ID);

                if (result_ids.length == limit) {
                    break;
                }
            }
        }
        return result_ids;
    }

    // delete rows, given a list of their IDs in a table
    function deleteRows(table_name, ids) {
        for (var i = 0; i < ids.length; i++) {
            if (db.data[table_name].hasOwnProperty(ids[i])) {
                delete db.data[table_name][ids[i]];
            }
        }
        return ids.length;
    }

    // update rows
    function update(table_name, ids, update_function) {
        var ID = '', num = 0;

        for (var i = 0; i < ids.length; i++) {
            ID = ids[i];

            var updated_data = update_function(clone(db.data[table_name][ID]));

            if (updated_data) {
                delete updated_data['ID']; // no updates possible to ID

                var new_data = db.data[table_name][ID];
                // merge updated data with existing data
                for (var field in updated_data) {
                    if (updated_data.hasOwnProperty(field)) {
                        new_data[field] = updated_data[field];
                    }
                }

                db.data[table_name][ID] = validFields(table_name, new_data);
                num++;
            }
        }
        return num;
    }

    // commit the database to filesystem
    function commit(callback) {

        var data = sjcl.encrypt(String(db_id + path), JSON.stringify(db));
        data = JSON.stringify(data);
        var ofx = new OmegaFile();
        ofx.WriteFile(path + table_name + ".ivx", data, function (ret) {
            if ($.epar(ret) == true) {
                ofx = null;
                callback(_instance);
            } else {
                ofx = null;
                callback(null);
            }
        });

    }

    // serialize the database
    function serialize() {
        return JSON.stringify(db);
    }

    // throw an error
    function error(msg) {
        throw new Error(msg);
    }

    // clone an object
    function clone(obj) {
        var new_obj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                new_obj[key] = obj[key];
            }
        }
        return new_obj;
    }

    // validate db, table, field names (alpha-numeric only)
    function validateName(name) {
        return name.match(/[^a-z_0-9]/ig) ? false : true;
    }

    // given a data list, only retain valid fields in a table
    function validFields(table_name, data) {
        var field = '', new_data = {};
        for (var i = 0; i < db.tables[table_name].fields.length; i++) {
            field = db.tables[table_name].fields[i];
            if (data[field] != undefined) {
                new_data[field] = data[field];
            }
        }
        return new_data;
    }

    // given a data list, populate with valid field names of a table
    function validateData(table_name, data) {
        var field = '', new_data = {};
        for (var i = 0; i < db.tables[table_name].fields.length; i++) {
            field = db.tables[table_name].fields[i];
            new_data[field] = (data[field] != undefined) ? data[field] : null;
        }
        return new_data;
    }



    // ______________________ public methods

    return {
        init: function (callback) {
            Init(callback);
        },
        // commit the database to localStorage
        commit: function (callback) {
            commit(callback);
        },

        // is this instance a newly created database?
        isNew: function () {
            return db_new;
        },

        // delete the database
        drop: function (callback) {
            drop(callback);
        },

        // serialize the database
        serialize: function () {
            return serialize();
        },

        // check whether a table exists
        tableExists: function (table_name) {
            return tableExists(table_name);
        },

        // number of tables in the database
        tableCount: function () {
            return tableCount();
        },

        // create a table
        createTable: function (table_name, fields) {
            var result = false;
            if (!validateName(table_name)) {
                error("The database name '" + table_name + "'" + " contains invalid characters.");
            } else if (this.tableExists(table_name)) {
                error("The table name '" + table_name + "' already exists.");
            } else {
                // make sure field names are valid
                var is_valid = true;
                for (var i = 0; i < fields.length; i++) {
                    if (!validateName(fields[i])) {
                        is_valid = false;
                        break;
                    }
                }

                if (is_valid) {
                    // cannot use indexOf due to <IE9 incompatibility
                    // de-duplicate the field list
                    var fields_literal = {};
                    for (var i = 0; i < fields.length; i++) {
                        fields_literal[fields[i]] = true;
                    }
                    delete fields_literal['ID']; // ID is a reserved field name

                    fields = ['ID'];
                    for (var field in fields_literal) {
                        if (fields_literal.hasOwnProperty(field)) {
                            fields.push(field);
                        }
                    }

                    createTable(table_name, fields);
                    result = true;
                } else {
                    error("One or more field names in the table definition contains invalid characters.");
                }
            }

            return result;
        },

        // drop a table
        dropTable: function (table_name) {
            tableExistsWarn(table_name);
            dropTable(table_name);
        },

        // empty a table
        truncate: function (table_name) {
            tableExistsWarn(table_name);
            truncate(table_name);
        },

        // number of rows in a table
        rowCount: function (table_name) {
            tableExistsWarn(table_name);
            return rowCount(table_name);
        },

        // insert a row
        insert: function (table_name, data) {
            tableExistsWarn(table_name);
            return insert(table_name, validateData(table_name, data));
        },

        // update rows
        update: function (table_name, query, update_function) {
            tableExistsWarn(table_name);

            var result_ids = [];
            if (!query) {
                result_ids = getIDs(table_name); 			// there is no query. applies to all records
            } else if (typeof query == 'object') {				// the query has key-value pairs provided
                result_ids = queryByValues(table_name, validFields(table_name, query));
            } else if (typeof query == 'function') {				// the query has a conditional map function provided
                result_ids = queryByFunction(table_name, query);
            }
            return update(table_name, result_ids, update_function);
        },

        query_paged: function (table_name, parameters, query_function) {
            tableExistsWarn(table_name);
            var result_ids = [];
            result_ids = queryByValuesFunction(table_name, validFields(table_name, parameters), query_function);
            return select(table_name, result_ids);
        },

        // select rows
        query: function (table_name, parameters, limit) {

            tableExistsWarn(table_name);
            var result_ids = [];
            if (!parameters) {
                result_ids = getIDs(table_name, limit); // no conditions given, return all records
            } else {

                if (bProduct && ProductsBlob) {

                    var tmp_results = "";
                    var rx = null;
                    var search_result = ProductsBlob;
                    var data = validFields(table_name, parameters);

                    for (var field in data) {

                        if (typeof data[field] == 'string') {
                            //var rx = new RegExp('"([^{]*"' + field + '"\:".*' + data[field].replace(/\%/g, '') + '.*"[^}]*)"', 'gi');
                            var rx = new RegExp('"([^{]*' + data[field].replace(/\%/g, '') + '[^}]*)"', 'gi');
                        } else {
                            rx = new RegExp('"([^{]*"' + field + '":' + data[field] + ',[^}]*)"', 'gi');
                        }

                        while (result = rx.exec(search_result)) { tmp_results += '{"' + result[1] + '"}§'; }

                        if (tmp_results.indexOf('auto_increment') > 0) tmp_results = tmp_results.substr(tmp_results.indexOf('§') + 1);

                        search_result = tmp_results;

                        tmp_results = "";
                    }

                    var arrResults = [];
                    var arrTmp = [];

                    if (search_result != '') {
                        arrTmp = search_result.split('§');
                        arrTmp.pop();

                        for (var i = 0; i < arrTmp.length; i++) {
                            arrResults.push(eval('(' + arrTmp[i] + ')'));
                        }
                        return arrResults;
                    }

                } else {
                    if (typeof parameters == 'object') {			// the query has key-value pairs provided
                        result_ids = queryByValues(table_name, validFields(table_name, parameters), limit);
                    } else if (typeof parameters == 'function') {		// the query has a conditional map function provided
                        result_ids = queryByFunction(table_name, parameters, limit);
                    }
                }

            }

            return select(table_name, result_ids, limit);
        },

        // delete rows
        deleteRows: function (table_name, query) {
            tableExistsWarn(table_name);

            var result_ids = [];
            if (!query) {
                result_ids = getIDs(table_name);
            } else if (typeof query == 'object') {
                result_ids = queryByValues(table_name, validFields(table_name, query));
            } else if (typeof query == 'function') {
                result_ids = queryByFunction(table_name, query);
            }
            return deleteRows(table_name, result_ids);
        }
    }
}