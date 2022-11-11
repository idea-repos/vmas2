import datetime
import json
from collections import namedtuple
from pymongo import MongoClient
from vmasbackend import config

order_dict = {'asc': 1, 'desc': -1}

class DataTablesServer(object):

    def __init__(self, request, columns, collection):

        self.request = request
        self.columns = columns
        self.collection = collection

        # values specified by the datatable for filtering, sorting, paging
        self.request_values = json.loads(request.body.decode('utf-8'))
        
        #### only for testing #######   
        # self.request_values = {}
        # self.request_values["sEcho"] = "1"
        # self.request_values["iDisplayStart"] = 0
        # self.request_values["iDisplayLength"] = 10
        # self.request_values["sSearch"] =  "use"
        # self.request_values["iSortCol_0"] = 1
        # self.request_values["iSortingCols"] = 1
        # self.request_values["sSortDir_0"] = "desc"
        # ###### only for testing ####### 
        # results from the db
        self.result_data = None

        # total in the table after filtering
        self.cardinality_filtered = 0

        # total in the table unfiltered
        self.cardinality = 0

        self.run_queries()

    def output_result(self):

        output = {}
        output['sEcho'] = str(int(self.request_values['sEcho']))
        output['iTotalRecords'] = str(self.cardinality)
        output['iTotalDisplayRecords'] = str(self.cardinality_filtered)
        aaData_rows = []

        for row in self.result_data:
            aaData_row = {}

            for i in range(len(self.columns)):
                try:
                    if self.columns[i] == 'created_on':
                        aaData_row[self.columns[i]] = datetime.date.strftime(row[self.columns[i]], "%Y/%m/%d %H:%M")
                    elif self.columns[i] == '_id':
                        try:
                            aaData_row[self.columns[i]] = str(row.get('_id'))
                        except Exception as e:
                            print(e)
                    else:
                        if self.columns[i] in row:
                           aaData_row[self.columns[i]] = row[self.columns[i]]
                except Exception as e:
                    print(e)
                    
            aaData_rows.append(aaData_row)
            output['aaData'] = aaData_rows

        return output

    def run_queries(self):

        # 'mydb' is the actual name of your database
        mydb = ''

        # the term you entered into the datatable search
        _filter = self.filtering()

        # the document field you chose to sort
        sorting = self.sorting()

        # get result from db to display on the current page
        client = MongoClient(str(config.DATABASE_CONFIGURATION['mongodb']['HOST']), int(config.DATABASE_CONFIGURATION['mongodb']['PORT']))
        db = client[str(config.DATABASE_CONFIGURATION['mongodb']['NAME'])]
        collection  = db[self.collection]
        
        pages = namedtuple('pages', ['start', 'length'])

        pages.start = int(self.request_values['iDisplayStart'])
        pages.length = int(self.request_values['iDisplayLength'])

        
        self.result_data = collection.find(filter = _filter,
                                           skip = pages.start,
                                           limit = pages.length,
                                           sort = sorting)

        # length of filtered set
        # self.cardinality_filtered = collection.find(filter=_filter).count()
        
        # length of original set
        # self.cardinality = collection.find({}).count()
        client.close()

    def filtering(self):

        # build your filter spec
        _filter = {}

        if ('sSearch' in self.request_values) and (self.request_values['sSearch'] != ""):

            # the term put into search is logically concatenated with 'or' between all columns
            or_filter_on_all_columns = []

            for i in range(len(self.columns)):
                column_filter = {}
                # case insensitive partial string matching pulled from user input
                column_filter[self.columns[i]] = {'$regex': self.request_values['sSearch'], '$options': 'i'}
                or_filter_on_all_columns.append(column_filter)

            _filter['$or'] = or_filter_on_all_columns

        # individual column filtering - uncomment if needed

        and_filter_individual_columns = []
        for i in range(len(self.columns)):

           key = ('sSearch_%d' % i)

           if (key in self.request_values)  and (self.request_values['sSearch_%d' % i] != ''):

               individual_column_filter = {}
               individual_column_filter[self.columns[i]] = {'$regex': self.request_values['sSearch_%d' % i], '$options': 'i'}
               and_filter_individual_columns.append(individual_column_filter)

        if and_filter_individual_columns:
           _filter['$and'] = and_filter_individual_columns

        return _filter

    def sorting(self):

        order = []
        # mongo translation for sorting order
        if (self.request_values['iSortCol_0'] != "") and (int(self.request_values['iSortingCols']) > 0):

            for i in range(int(self.request_values['iSortingCols'])):
                # column number
                column_number = int(self.request_values['iSortCol_' + str(i)])
                # sort direction
                sort_direction = self.request_values['sSortDir_' + str(i)]

                order.append((self.columns[column_number], order_dict[sort_direction]))

            return order
