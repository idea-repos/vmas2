/*
TODO: 
extract interface and put in there own sections (inside of types.ts)
extract common functionality | component like pagination, search bar 
improve performance | reduce re-rendering | Use Memo
use LINK avoid ROUTE
Improve | finish api/CallSuccess api/CallError (flash message, navigate and more) functionality
*/

interface target {
    id : number, 
    name: string,
    created_at : number,
    notes : string,
    description: string,
    details : {id:number, attribute:string, condition:string, value:string}[]
}

export interface region {
    id : number;
    name : string;
    sub_region : number;
    created_at : number;
}

export interface source {
    id : number;
    source : string;
    alias : string;
    intercept_on : number;
}

export interface speaker {
    id: number;
    name: string;
    created_at: number
}

export interface language {
    id: number;
    name: string;
    created_at: number
}

export interface category {
    id: number;
    name: string;
    created_at: number
}

export interface precedence {
    id: number;
    name: string;
    created_at: number
}

export interface keyword {
    id: number;
    name: string;
    created_at: number
}

export interface receiver {
    id: number;
    name: string;
    created_at: number
}

export const allTargets : target[] = [
    {
        id:1, 
        name:'TargetAzhar', 
        created_at:Date.now(), 
        notes:'', 
        description:'nothing went wrong',
        details:[
            {id:1, attribute:'call number', condition:'Equal', value:'32432'},
            {id:2, attribute:'Mail', condition:'Not Equal', value:'32432'},
            {id:3, attribute:'call number', condition:'Equal', value:'32432'},
        ]
    },
    
    {
        id:2, 
        name:'targetPranjali', 
        created_at:Date.now(), 
        notes:'', 
        description:'nothing went wrong',
        details:[
            {id:1, attribute:'call number', condition:'Contains', value:'32432'},
        ]
    },
    {
        id:3, 
        name:'targetIdea', 
        created_at:Date.now(), 
        notes:'Delete in progress', 
        description:'nothing went wrong',
        details:[
            {id:1, attribute:'IMEI', condition:'Equal', value:'x232'},
            {id:2, attribute:'Chart Id', condition:'Contains', value:'432'},
            {id:3, attribute:'call number', condition:'Equal', value:'32432'},
        ]
    },
]

export const getDataById = (id: number) => {
    return allTargets.filter(target => target.id === id)[0]
}

export const allSpeaker : speaker[] = [
    {id: 1, name: 'A', created_at : Date.now()},
    {id: 2, name: 'B', created_at: Date.now()},
    {id: 3, name: 'C', created_at : Date.now()}
]

export const allPrecedence : precedence[] = [
    {id: 1, name: 'minority', created_at : Date.now()},
    {id: 2, name: 'majority', created_at: Date.now()},
    {id: 3, name: 'community', created_at : Date.now()},
    {id:4, name: 'socially', created_at: Date.now()}
]

export const receivers : receiver[] = [
    {id: 1, name: 'Amit Badana', created_at : Date.now()},
    {id: 2, name: 'Ashish Chinchlani', created_at: Date.now()},
    {id: 3, name: 'BB ki Vines', created_at : Date.now()},
    {id:4, name: 'Round 2 Hell', created_at: Date.now()}
]

export const keywords : keyword[] = [
    {id: 1, name: 'Null', created_at : Date.now()},
    {id: 2, name: 'None', created_at: Date.now()},
    {id: 3, name: 'def', created_at : Date.now()},
    {id:4, name: 'class', created_at: Date.now()}
]

export const languages : language[] = [
    {id: 1, name: 'Hindi', created_at : Date.now()},
    {id: 2, name: 'Urdu', created_at: Date.now()},
    {id: 3, name: 'Sanskrit', created_at : Date.now()},
    {id:4, name: 'English', created_at: Date.now()}
]

export const categories : category[] = [
    {id: 1, name: 'Category 1', created_at : Date.now()},
    {id: 2, name: 'Category 2', created_at: Date.now()},
    {id: 3, name: 'Category 3', created_at : Date.now()},
    {id:4, name: 'Category 4', created_at: Date.now()}
]

export const sources : source[] = [
    {id: 1, source: 'FileSat_RHCP_0036985285', alias:'File Sat', intercept_on: Date.now()},
    {id: 2, source: 'FileSat_VP_010920294000', alias:'Sat Fuke', intercept_on: Date.now()},
    {id: 3, source: 'FileSat_VP_010801064100', alias:'', intercept_on: Date.now()},
    {id: 4, source: 'FileSat_VP_010758260000', alias:'VP 010', intercept_on: Date.now()},
    {id: 5, source: 'FileSat_VP_010827381000', alias:'', intercept_on: Date.now()},
    {id: 6, source: 'Test01_LHCP_00676443684', alias:'', intercept_on: Date.now()},
    {id: 7, source: 'FileSat_VP_011180015964', alias:'', intercept_on: Date.now()},
    {id: 8, source: 'FileSat_VP_011184681000', alias:'', intercept_on: Date.now()},
    {id: 9, source: 'FileSat_VP_011184681020', alias:'', intercept_on: Date.now()},
]

export const regions : region[] = [
    {id: 1, name: 'Asia', sub_region: 3, created_at: Date.now()},
    {id: 2, name: 'Australia', sub_region: 2, created_at: Date.now()},
    {id: 3, name: 'India', sub_region: 1, created_at: Date.now()},
    {id: 4, name: 'Russia', sub_region: 5, created_at: Date.now()}
]