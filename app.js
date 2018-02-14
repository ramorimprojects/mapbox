/**
 * Module dependencies.
 */


var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();


var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'bmscode_db'
};


var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();


//RCBSILVA -- EXPRESS
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('server'));


//SSO

const https = require('https');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';



app.use(cookieParser());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));

app.use(session({
  resave: 'true',
  saveUninitialized: 'true',
  secret: 'c88ad32c3918a7a797f0dcc5d36c0855',
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));


var ensureAuthenticated = require('./server/sso/ensureAuthenticated.js');

require('./server/sso/sso.passport')(app);
app.use(require('./server/sso/sso.router'));

app.get('/', [ensureAuthenticated], (req, res) => {
    console.log('autenticado');
    res.sendFile(path.resolve(__dirname, 'views', 'index.html'));
});
// Always return the main index.html, so react-router render the respective route component in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'views', 'index.html'));
});

if (process.env.NODE_ENV === 'development') {
  https.createServer({
    key: fs.readFileSync('server/sso/key.pem'),
    cert: fs.readFileSync('server/sso/cert.pem')
  }, app).listen(port, () => console.log(`Server started on ${port}`));
} else {
  app.listen(port, () => console.log(`Server started on ${port}`));
}
//fim do SSO






// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));








// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}



function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Once you have the credentials, paste them into a file called vcap-local.json.
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}

initDBConnection();

app.get('/', routes.index);

function createResponseData(id, name, value, attachments) {

    var responseData = {
        id: id,
        name: sanitizeInput(name),
        value: sanitizeInput(value),
        attachements: []
    };


    attachments.forEach(function(item, index) {
        var attachmentData = {
            content_type: item.type,
            key: item.key,
            url: '/api/favorites/attach?id=' + id + '&key=' + item.key
        };
        responseData.attachements.push(attachmentData);

    });
    return responseData;
}



function sanitizeInput(str) {
    return String(str).replace(/&(?!amp;|lt;|gt;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

var saveDocument = function(id, reqType, UpdateListDisplay1, LineofBusiness, UpdateBT, NewBT, fBusinessTitle, ftBTJustification,
              fCompetencySegment, fBTStatus, fNATOP, fDivCost, fMajCost, fMinorCost, fSubMinorCost, fLeruCost,
              fDivContractorCost, fMajContractorCost, fMinorContractorCost, fSubContractorMinorCost, fLeruContractorCost,
              fDivRevenue, fMajRevenue, fMinorRevenue, fSubMinorRevenue, fLeruRevenue, fDivEarlyRevenue, fMajEarlyRevenue, fMinoEarlyrRevenue,
              fSubEarlyMinorRevenue, fLeruEarlyRevenue, fDivTax, fMajTax, fMinorTax, fSubMinorTax, fLeruTax, fDivEarlyTax, fMajEarlyTax,
              fMinorEarlyTax, fSubMinorEarlyTax, fEarlyLeruTax, fDivExpenses, fMajExpenses, fMinorExpenses, fSubMinorExpenses, fLeruExpenses )
              {

    if (id === undefined) {
        // Generated random id
        id = '';
    }
//Campos do Form
    db.insert({
        reqType: reqType,
        UpdateListDisplay1: UpdateListDisplay1,
        LineofBusiness: LineofBusiness,
        UpdateBT: UpdateBT,
        NewBT: NewBT,
        fBusinessTitle: fBusinessTitle,
        ftBTJustification: ftBTJustification,
        fCompetencySegment: fCompetencySegment,
        fBTStatus: fBTStatus,
        fNATOP: fNATOP,
        fDivCost: fDivCost,
        fMajCost: fMajCost,
        fMinorCost: fMinorCost,
        fSubMinorCost: fSubMinorCost,
        fLeruCost: fLeruCost,
        fDivContractorCost: fDivContractorCost,
        fMajContractorCost: fMajContractorCost,
        fMinorContractorCost: fMinorContractorCost,
        fSubContractorMinorCost: fSubContractorMinorCost,
        fLeruContractorCost: fLeruContractorCost,
        fDivRevenue: fDivRevenue,
        fMajRevenue: fMajRevenue,
        fMinorRevenue: fMinorRevenue,
        fSubMinorRevenue: fSubMinorRevenue,
        fLeruRevenue: fLeruRevenue,
        fDivEarlyRevenue: fDivEarlyRevenue,
        fMajEarlyRevenue: fMajEarlyRevenue,
        fMinoEarlyrRevenue: fMinoEarlyrRevenue,
        fSubEarlyMinorRevenue: fSubEarlyMinorRevenue,
        fLeruEarlyRevenue: fLeruEarlyRevenue,
        fDivTax: fDivTax,
        fMajTax: fMajTax,
        fMinorTax: fMinorTax,
        fSubMinorTax: fSubMinorTax,
        fLeruTax: fLeruTax,
        fDivEarlyTax: fDivEarlyTax,
        fMajEarlyTax: fMajEarlyTax,
        fMinorEarlyTax: fMinorEarlyTax,
        fSubMinorEarlyTax: fSubMinorEarlyTax,
        fEarlyLeruTax: fEarlyLeruTax,
        fDivExpenses: fDivExpenses,
        fMajExpenses: fMajExpenses,
        fMinorExpenses: fMinorExpenses,
        fSubMinorExpenses: fSubMinorExpenses,
        fLeruExpenses: fLeruExpenses

    }, id, function(err, doc) {
        if (err) {
            console.log(err);
        //    response.sendStatus(500);
            console.log(500);
        } else
            console.log(200);
        //    response.sendStatus(200);
        //    response.end();
    });
}




app.get('/api/favorites/attach', function(request, response) {
    var doc = request.query.id;
    var key = request.query.key;

    db.attachment.get(doc, key, function(err, body) {
        if (err) {
            response.status(500);
            response.setHeader('Content-Type', 'text/plain');
            response.write('Error: ' + err);
            response.end();
            return;
        }

        response.status(200);
        response.setHeader("Content-Disposition", 'inline; filename="' + key + '"');
        response.write(body);
        response.end();
        return;
    });
});

/*
app.post('/api/favorites/attach', multipartMiddleware, function(request, response) {

    console.log("Upload File Invoked..");
    console.log('Request: ' + JSON.stringify(request.headers));

    var id;

    db.get(request.query.id, function(err, existingdoc) {

        var isExistingDoc = false;
        if (!existingdoc) {
            id = '-1';
        } else {
            id = existingdoc.id;
            isExistingDoc = true;
        }

        var name = sanitizeInput(request.query.name);
        var value = sanitizeInput(request.query.value);

        var file = request.files.file;
        var newPath = './public/uploads/' + file.name;

        var insertAttachment = function(file, id, rev, name, value, response) {

            fs.readFile(file.path, function(err, data) {
                if (!err) {

                    if (file) {

                        db.attachment.insert(id, file.name, data, file.type, {
                            rev: rev
                        }, function(err, document) {
                            if (!err) {
                                console.log('Attachment saved successfully.. ');

                                db.get(document.id, function(err, doc) {
                                    console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));

                                    var attachements = [];
                                    var attachData;
                                    for (var attachment in doc._attachments) {
                                        if (attachment == value) {
                                            attachData = {
                                                "key": attachment,
                                                "type": file.type
                                            };
                                        } else {
                                            attachData = {
                                                "key": attachment,
                                                "type": doc._attachments[attachment]['content_type']
                                            };
                                        }
                                        attachements.push(attachData);
                                    }
                                    var responseData = createResponseData(
                                        id,
                                        name,
                                        value,
                                        attachements);
                                    console.log('Response after attachment: \n' + JSON.stringify(responseData));
                                    response.write(JSON.stringify(responseData));
                                    response.end();
                                    return;
                                });
                            } else {
                                console.log(err);
                            }
                        });
                    }
                }
            });
        }

        if (!isExistingDoc) {
            existingdoc = {
                name: name,
                value: value,
                create_date: new Date()
            };

            // save doc
            db.insert({
                name: name,
                value: value
            }, '', function(err, doc) {
                if (err) {
                    console.log(err);
                } else {

                    existingdoc = doc;
                    console.log("New doc created ..");
                    console.log(existingdoc);
                    insertAttachment(file, existingdoc.id, existingdoc.rev, name, value, response);

                }
            });

        } else {
            console.log('Adding attachment to existing doc.');
            console.log(existingdoc);
            insertAttachment(file, existingdoc._id, existingdoc._rev, name, value, response);
        }

    });

});

*/




app.post('/api/favorites', function(request, response) {

    console.log("Create Invoked..");
    console.log(request.body);
    console.log("reqType: " + request.body.reqType);
    console.log("UpdateListDisplay1: " + request.body.UpdateListDisplay1);
    console.log("UpdateBT: " + request.body.UpdateBT);
    console.log("NewBT: " + request.body.NewBT);
    console.log("fBusinessTitle: " + request.body.fBusinessTitle);
    console.log("ftBTJustification: " + request.body.ftBTJustification);
    console.log("fCompetencySegment: " + request.body.fCompetencySegment);
    console.log("fBTStatus: " + request.body.fBTStatus);
    console.log("fNATOP: " + request.body.fNATOP);

    // var id = request.body.id;
    var reqType = sanitizeInput(request.body.reqType);
    var UpdateListDisplay1 = sanitizeInput(request.body.UpdateListDisplay1);
    var LineofBusiness = sanitizeInput(request.body.LineofBusiness);
    var UpdateBT = sanitizeInput(request.body.UpdateBT);
    var NewBT = sanitizeInput(request.body.NewBT);
    var fBusinessTitle = sanitizeInput(request.body.fBusinessTitle);
    var ftBTJustification = sanitizeInput(request.body.ftBTJustification);
    var fCompetencySegment = sanitizeInput(request.body.fCompetencySegment);
    var fBTStatus = sanitizeInput(request.body.fBTStatus);
    var fNATOP = sanitizeInput(request.body.fNATOP);
    var fDivCost = sanitizeInput(request.body.fDivCost);
    var fMajCost = sanitizeInput(request.body.fMajCost);
    var fMinorCost = sanitizeInput(request.body.fMinorCost);
    var fSubMinorCost = sanitizeInput(request.body.fSubMinorCost);
    var fLeruCost = sanitizeInput(request.body.fLeruCost);
    var fDivContractorCost = sanitizeInput(request.body.fDivContractorCost);
    var fMajContractorCost = sanitizeInput(request.body.fMajContractorCost);
    var fMinorContractorCost = sanitizeInput(request.body.fMinorContractorCost);
    var fSubContractorMinorCost = sanitizeInput(request.body.fSubContractorMinorCost);
    var fLeruContractorCost = sanitizeInput(request.body.fLeruContractorCost);
    var fDivRevenue = sanitizeInput(request.body.fDivRevenue);
    var fMajRevenue = sanitizeInput(request.body.fMajRevenue);
    var fMinorRevenue = sanitizeInput(request.body.fMinorRevenue);
    var fSubMinorRevenue = sanitizeInput(request.body.fSubMinorRevenue);
    var fLeruRevenue = sanitizeInput(request.body.fLeruRevenue);
    var fDivEarlyRevenue = sanitizeInput(request.body.fDivEarlyRevenue);
    var fMajEarlyRevenue = sanitizeInput(request.body.fMajEarlyRevenue);
    var fMinoEarlyrRevenue = sanitizeInput(request.body.fMinoEarlyrRevenue);
    var fSubEarlyMinorRevenue = sanitizeInput(request.body.fSubEarlyMinorRevenue);
    var fLeruEarlyRevenue = sanitizeInput(request.body.fLeruEarlyRevenue);
    var fDivTax = sanitizeInput(request.body.fDivTax);
    var fMajTax = sanitizeInput(request.body.fMajTax);
    var fMinorTax = sanitizeInput(request.body.fMinorTax);
    var fSubMinorTax = sanitizeInput(request.body.fSubMinorTax);
    var fLeruTax = sanitizeInput(request.body.fLeruTax);
    var fDivEarlyTax = sanitizeInput(request.body.fDivEarlyTax);
    var fMajEarlyTax = sanitizeInput(request.body.fMajEarlyTax);
    var fMinorEarlyTax = sanitizeInput(request.body.fMinorEarlyTax);
    var fSubMinorEarlyTax = sanitizeInput(request.body.fSubMinorEarlyTax);
    var fEarlyLeruTax = sanitizeInput(request.body.fEarlyLeruTax);
    var fDivExpenses = sanitizeInput(request.body.fDivExpenses);
    var fMajExpenses = sanitizeInput(request.body.fMajExpenses);
    var fMinorExpenses = sanitizeInput(request.body.fMinorExpenses);
    var fSubMinorExpenses = sanitizeInput(request.body.fSubMinorExpenses);
    var fLeruExpenses = sanitizeInput(request.body.fLeruExpenses);

    saveDocument(null, reqType, UpdateListDisplay1, LineofBusiness, UpdateBT, NewBT, fBusinessTitle, ftBTJustification,
                fCompetencySegment, fBTStatus, fNATOP, fDivCost, fMajCost, fMinorCost,fSubMinorCost, fLeruCost, fDivContractorCost,
                fMajContractorCost, fMinorContractorCost, fSubContractorMinorCost, fLeruContractorCost,
                fDivRevenue, fMajRevenue, fMinorRevenue, fSubMinorRevenue, fLeruRevenue, fDivEarlyRevenue, fMajEarlyRevenue, fMinoEarlyrRevenue,
                fSubEarlyMinorRevenue, fLeruEarlyRevenue, fDivTax, fMajTax, fMinorTax, fSubMinorTax, fLeruTax, fDivEarlyTax, fMajEarlyTax,
                fMinorEarlyTax, fSubMinorEarlyTax, fEarlyLeruTax, fDivExpenses, fMajExpenses, fMinorExpenses, fSubMinorExpenses, fLeruExpenses
              );
});

app.delete('/api/favorites', function(request, response) {

    console.log("Delete Invoked..");
    var id = request.query.id;
    // var rev = request.query.rev; // Rev can be fetched from request. if
    // needed, send the rev from client
    console.log("Removing document of ID: " + id);
    console.log('Request Query: ' + JSON.stringify(request.query));

    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            db.destroy(doc._id, doc._rev, function(err, res) {
                // Handle response
                if (err) {
                    console.log(err);
                    response.sendStatus(500);
                } else {
                    response.sendStatus(200);
                }
            });
        }
    });

});

app.put('/api/favorites', function(request, response) {

    console.log("Update Invoked..");

    var id = request.body.id;
    var name = sanitizeInput(request.body.name);
    var value = sanitizeInput(request.body.value);

    console.log("ID: " + id);

    db.get(id, {
        revs_info: true
    }, function(err, doc) {
        if (!err) {
            console.log(doc);
            doc.name = name;
            doc.value = value;
            db.insert(doc, doc.id, function(err, doc) {
                if (err) {
                    console.log('Error inserting data\n' + err);
                    return 500;
                }
                return 200;
            });
        }
    });
});



app.get('/api/favorites', function(request, response) {

    console.log("Get method invoked.. ")

    db = cloudant.use(dbCredentials.dbName);
    var docList = [];
    var i = 0;
    db.list(function(err, body) {
        if (!err) {
            var len = body.rows.length;
            console.log('total # of docs -> ' + len);
            if (len == 0) {
                // push sample data
                // save doc
                var docName = 'sample_doc';
                var docDesc = 'A sample Document';
                db.insert({
                    name: docName,
                    value: 'A sample Document'
                }, '', function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {

                        console.log('Document : ' + JSON.stringify(doc));
                        var responseData = createResponseData(
                            doc.id,
                            docName,
                            docDesc, []);
                        docList.push(responseData);
                        response.write(JSON.stringify(docList));
                        console.log(JSON.stringify(docList));
                        console.log('ending response...');
                        response.end();
                    }
                });
            } else {

                body.rows.forEach(function(document) {

                    db.get(document.id, {
                        revs_info: true
                    }, function(err, doc) {
                        if (!err) {
                            if (doc['_attachments']) {

                                var attachments = [];
                                for (var attribute in doc['_attachments']) {

                                    if (doc['_attachments'][attribute] && doc['_attachments'][attribute]['content_type']) {
                                        attachments.push({
                                            "key": attribute,
                                            "type": doc['_attachments'][attribute]['content_type']
                                        });
                                    }
                                    console.log(attribute + ": " + JSON.stringify(doc['_attachments'][attribute]));
                                }
                                var responseData = createResponseData(
                                    doc._id,
                                    doc.name,
                                    doc.value,
                                    attachments);

                            } else {
                                var responseData = createResponseData(
                                    doc._id,
                                    doc.name,
                                    doc.value, []);
                            }

                            docList.push(responseData);
                            i++;
                            if (i >= len) {
                                response.write(JSON.stringify(docList));
                                console.log('ending response...');
                                response.end();
                            }
                        } else {
                            console.log(err);
                        }
                    });

                });
            }

        } else {
            console.log(err);
        }
    });

});





//index.js

var REST_DATA = 'api/favorites';
var KEY_ENTER = 13;
var defaultItems = [

];

function encodeUriAndQuotes(untrustedStr) {
    return encodeURI(String(untrustedStr)).replace(/'/g, '%27').replace(')', '%29');
}

function loadItems() {
    xhrGet(REST_DATA, function(data) {

        //stop showing loading message
        stopLoadingMessage();

        var receivedItems = data || [];
        var items = [];
        var i;
        // Make sure the received items have correct format
        for (i = 0; i < receivedItems.length; ++i) {
            var item = receivedItems[i];
            if (item && 'id' in item) {
                items.push(item);
            }
        }
        var hasItems = items.length;
        if (!hasItems) {
            items = defaultItems;
        }
        for (i = 0; i < items.length; ++i) {
            addItem(items[i], !hasItems);
        }
        if (!hasItems) {
            var table = document.getElementById('notes');
            var nodes = [];
            for (i = 0; i < table.rows.length; ++i) {
                nodes.push(table.rows[i].firstChild.firstChild);
            }

            function save() {
                if (nodes.length) {
                    saveChange(nodes.shift(), save);
                }
            }
            save();
        }
    }, function(err) {
        console.error(err);
    });
}

function startProgressIndicator(row) {
    row.innerHTML = "<td class='content'>Uploading file... <img height=\"50\" width=\"50\" src=\"images/loading.gif\"></img></td>";
}

function removeProgressIndicator(row) {
    row.innerHTML = "<td class='content'>uploaded...</td>";
}

function addNewRow(table) {
    var newRow = document.createElement('tr');
    table.appendChild(newRow);
    return table.lastChild;
}

function uploadFile(node) {

    var file = node.previousSibling.files[0];

    //if file not selected, throw error
    if (!file) {
        alert("File not selected for upload... \t\t\t\t \n\n - Choose a file to upload. \n - Then click on Upload button.");
        return;
    }

    var row = node.parentNode.parentNode.parentNode;

    var form = new FormData();
    form.append("file", file);

    var id = row.getAttribute('data-id');

    var queryParams = "id=" + (id == null ? -1 : id);
    queryParams += "&name=" + row.firstChild.firstChild.value;
    queryParams += "&value=" + row.firstChild.nextSibling.firstChild.value;


    var table = row.firstChild.nextSibling.firstChild;
    var newRow = addNewRow(table);

    startProgressIndicator(newRow);

    xhrAttach(REST_DATA + "/attach?" + queryParams, form, function(item) {
        console.log('Item id - ' + item.id);
        console.log('attached: ', item);
        row.setAttribute('data-id', item.id);
        removeProgressIndicator(row);
        setRowContent(item, row);
    }, function(err) {
        console.error(err);
    });

}

var attachButton = "<br><div class='uploadBox'><input type=\"file\" name=\"file\" id=\"upload_file\"><input width=\"100\" type=\"submit\" value=\"Upload\" onClick='uploadFile(this)'></div>";

function setRowContent(item, row) {
    var innerHTML = "<td class='contentName'><textarea id='nameText' class = 'nameText' onkeydown='onKey(event)'>" + item.name + "</textarea></td><td class='contentDetails'>";

    var valueTextArea = "<textarea id='valText' onkeydown='onKey(event)' placeholder=\"Enter a description...\"></textarea>";
    if (item.value) {
        valueTextArea = "<textarea id='valText' onkeydown='onKey(event)'>" + item.value + "</textarea>";
    }

    innerHTML += valueTextArea;


    var attachments = item.attachements;
    if (attachments && attachments.length > 0) {
        innerHTML += "<div class='flexBox'>";
        for (var i = 0; i < attachments.length; ++i) {
            var attachment = attachments[i];

            if (attachment.content_type.indexOf("image/") == 0) {
                innerHTML += "<div class='contentTiles'>" + attachment.key + "<br><img height=\"150\" src=\"" + encodeUriAndQuotes(attachment.url) + "\" onclick='window.open(\"" + encodeUriAndQuotes(attachment.url) + "\")'></img></div>";

            } else if (attachment.content_type.indexOf("audio/") == 0) {
                innerHTML += "<div class='contentTiles'>" + attachment.key + "<br><AUDIO  height=\"50\" src=\"" + encodeUriAndQuotes(attachment.url) + "\" controls></AUDIO></div>";

            } else if (attachment.content_type.indexOf("video/") == 0) {
                innerHTML += "<div class='contentTiles'>" + attachment.key + "<br><VIDEO  height=\"150\" src=\"" + encodeUriAndQuotes(attachment.url) + "\" controls></VIDEO></div>";

            } else if (attachment.content_type.indexOf("text/") == 0 || attachment.content_type.indexOf("application/") == 0) {
                innerHTML += "<div class='contentTiles'><a href=\"" + encodeUriAndQuotes(attachment.url) + "\" target=\"_blank\">" + attachment.key + "</a></div>";
            }

        }
        innerHTML += "</div>";

    }

    row.innerHTML = innerHTML + attachButton + "</td><td class = 'contentAction'><span class='deleteBtn' onclick='deleteItem(this)' title='delete me'></span></td>";

}

function addItem(item, isNew) {

    var row = document.createElement('tr');
    row.className = "tableRows";
    var id = item && item.id;
    if (id) {
        row.setAttribute('data-id', id);
    }

    if (item) // if not a new row
    {
        setRowContent(item, row);
    } else //if new row
    {
        row.innerHTML = "<td class='contentName'><textarea id='nameText' onkeydown='onKey(event)' placeholder=\"Enter a title for your favourites...\"></textarea></td><td class='contentDetails'><textarea id='valText'  onkeydown='onKey(event)' placeholder=\"Enter a description...\"></textarea>" + attachButton + "</td>" +
            "<td class = 'contentAction'><span class='deleteBtn' onclick='deleteItem(this)' title='delete me'></span></td>";
    }

    var table = document.getElementById('notes');
    table.lastChild.appendChild(row);
    row.isNew = !item || isNew;

    if (row.isNew) {
        var textarea = row.firstChild.firstChild;
        textarea.focus();
    }

}

function deleteItem(deleteBtnNode) {
    var row = deleteBtnNode.parentNode.parentNode;
    var attribId = row.getAttribute('data-id');
    if (attribId) {
        xhrDelete(REST_DATA + '?id=' + row.getAttribute('data-id'), function() {
            row.parentNode.removeChild(row);
        }, function(err) {
            console.error(err);
        });
    } else if (attribId == null) {
        row.parentNode.removeChild(row);
    }
}

function onKey(evt) {

    if (evt.keyCode == KEY_ENTER && !evt.shiftKey) {

        evt.stopPropagation();
        evt.preventDefault();
        var nameV, valueV;
        var row;

        if (evt.target.id == "nameText") {
            row = evt.target.parentNode.parentNode;
            nameV = evt.target.value;
            valueV = row.firstChild.nextSibling.firstChild.value;

        } else {
            row = evt.target.parentNode.parentNode;
            nameV = row.firstChild.firstChild.value;
            valueV = evt.target.value;
        }

        var data = {
            name: nameV,
            value: valueV
        };

        if (row.isNew) {
            delete row.isNew;
            xhrPost(REST_DATA, data, function(item) {
                row.setAttribute('data-id', item.id);
            }, function(err) {
                console.error(err);
            });
        } else {
            data.id = row.getAttribute('data-id');
            xhrPut(REST_DATA, data, function() {
                console.log('updated: ', data);
            }, function(err) {
                console.error(err);
            });
        }


        if (row.nextSibling) {
            row.nextSibling.firstChild.firstChild.focus();
        } else {
            addItem();
        }
    }
}

function saveChange(contentNode, callback) {
    var row = contentNode.parentNode.parentNode;

    var data = {
        name: row.firstChild.firstChild.value,
        value: row.firstChild.nextSibling.firstChild.value
    };

    if (row.isNew) {
        delete row.isNew;
        xhrPost(REST_DATA, data, function(item) {
            row.setAttribute('data-id', item.id);
            callback && callback();
        }, function(err) {
            console.error(err);
        });
    } else {
        data.id = row.getAttribute('data-id');
        xhrPut(REST_DATA, data, function() {
            console.log('updated: ', data);
        }, function(err) {
            console.error(err);
        });
    }
}

function toggleServiceInfo() {
    var node = document.getElementById('vcapservices');
    node.style.display = node.style.display == 'none' ? '' : 'none';
}

function toggleAppInfo() {
    var node = document.getElementById('appinfo');
    node.style.display = node.style.display == 'none' ? '' : 'none';
}


//function showLoadingMessage() {
//    document.getElementById('loadingImage').innerHTML = "Loading data " + "<img height=\"100\" width=\"100\" src=\"images/loading.gif\"></img>";
//}



//function stopLoadingMessage() {
//    document.getElementById('loadingImage').innerHTML = "";
//}

//showLoadingMessage();
//updateServiceInfo();
//loadItems();




