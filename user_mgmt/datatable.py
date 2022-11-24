import datetime
import json
from collections import namedtuple
from vmasbackend import config
from .models import Group, User
from django.db.models import Q

class DataTablesServer(object):

    def __init__(self, request, columns, model):

        self.request = request
        self.columns = columns
        self.model = model

        # values specified by the datatable for filtering, sorting, paging
        self.request_values = json.loads(request.body.decode('utf-8'))
        
        #### only for testing #######   
        # self.request_values = {}
        # self.request_values["sEcho"] = "1"
        # self.request_values["iDisplayStart"] = 0
        # self.request_values["iDisplayLength"] = 10
        # self.request_values["sSearch"] =  "role"
        # self.request_values["iSortCol_0"] = 1
        # self.request_values["iSortCol_1"] = 2
        # self.request_values["iSortingCols"] = 2
        # self.request_values["sSortDir_0"] = "desc"
        # self.request_values["sSortDir_1"] = "asc"
        ###### only for testing ####### 
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
                    if self.columns[i] == 'last_login':
                        if row[self.columns[i]] is not None: 
                             aaData_row[self.columns[i]] = datetime.date.strftime(row[self.columns[i]], "%m/%d/%Y %I:%M %p")
                        else: 
                             aaData_row[self.columns[i]] = "new account"
                    elif self.columns[i] == 'user_role':
                             aaData_row[self.columns[i]] = Group.objects.get(id=row['group_id']).name
                    elif self.columns[i] == 'users_count':
                             aaData_row[self.columns[i]] = User.objects.filter(group_id=row['id']).count()
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
        
        offset = namedtuple('offset', ['start', 'length'])
        
        if (self.request_values['iDisplayStart'] != "") and (self.request_values['iDisplayLength'] != -1):
            offset.start = int(self.request_values['iDisplayStart'])
            offset.length = int(self.request_values['iDisplayLength'])
            
        start, limit = offset.start, offset.start + offset.length
      
        if _filter == "":
            if sorting is None: 
                self.result_data =  self.model.objects.values()[start: limit] 
            else:
                self.result_data =  self.model.objects.values().order_by(*sorting)[start: limit] 
        else:
            if sorting is None:
                self.result_data =  self.model.objects.filter(_filter).values()[start: limit] 
            else:
                self.result_data =  self.model.objects.filter(_filter).values().order_by(*sorting)[start: limit] 

        # self.cardinality = self.result_data.count()    
        # self.cardinality_filtered = self.result_data.count()
        # self.cardinality = self.model.objects.all().count()
        
    def filtering(self):

        # build your filter spec
        _filter = ""

        if ('sSearch' in self.request_values) and (self.request_values['sSearch'] != ""):
            
            _filter = Q()

            for i in self.columns: 
                # Avoid Foreign key columns for filtering
                if i != 'user_role' and i != 'users_count':
                     _filter |= Q(**{'%s__icontains' % i: self.request_values['sSearch']})

        return _filter

    def sorting(self):

        order = []
        if (self.request_values['iSortCol_0'] != "") and (int(self.request_values['iSortingCols']) > 0):

            for i in range(int(self.request_values['iSortingCols'])):
                # column number
                column_number = int(self.request_values['iSortCol_' + str(i)])
                # Avoid Foreign key column for sorting
                if self.columns[column_number] == 'user_role' or self.columns[column_number] == 'users_count':
                   column_number = 1 
                # sort direction
                sort_direction = self.request_values['sSortDir_' + str(i)]
                
                if sort_direction == "asc":
                   order.append(self.columns[column_number])
                else:
                   order.append("-" + self.columns[column_number])
            return order