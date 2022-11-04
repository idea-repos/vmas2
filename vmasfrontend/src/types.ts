export interface permission {
    id : number;
    perm_section : string,
    perms_title : string,
}

export interface targetDetail {
    id: number
    attribute : string,
    condition: string,
    value: string
}

export interface sortColumn {
    path: string,
    order : boolean | "asc" | "desc"
}

export interface role {
    id : number;
    name : string,
    users_count : number,
    reports_to : string,
}

export default interface userDetail {
    username:string, 
    group:string, 
    is_active:boolean, 
    reporting_officer:string | null, 
    user_role:string
}

export interface target {
    id : number;
    name : string;
    created_at : Date | number;
    notes: string;
    description?: string;
    details: targetDetail[]
}

export interface user {
    id : number;
    username : string;
    role : string;
    lastlogin: Date | string;
    status : string;
    is_active: boolean | string;
}

export interface section {
    id: number;
    section_name: string,
    section_desc: string,
    allowed: boolean
}

