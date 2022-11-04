import { createSlice } from "@reduxjs/toolkit";
import { permission, section } from "../types";
import { apiCallBegan } from './api';
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from './http';

interface InitialState {
    list : section[],
    sectionPermissions : permission[],
    lastFetch : null | string
}

const initialState : InitialState = {
    list : [],
    sectionPermissions : [],
    lastFetch: null
}

//Endpoint 
const GET_URL_SECTION = 'api/sections'

const sectionsSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        sectionsReceived : (sections, action) => {
            sections.list = action.payload;
        },
        sectionCreated : (sections, action) => {
            sections.list.push({
                id: action.payload.data.id,
                section_name: action.payload.data.section_name,
                section_desc: action.payload.data.section_desc,
                allowed: action.payload.data.allowed,
            })
        },
        sectionUpdated : (sections, action) => {
            const index = sections.list.findIndex(section => section.id == action.payload.data.id);
            sections.list[index].section_name = action.payload.data.section_name
            sections.list[index].section_desc = action.payload.data.section_desc
            sections.list[index].allowed = action.payload.data.allowed
        },
        sectionDeleted : (sections, action) => {
            sections.list = sections.list.filter(section => section.id != action.payload.id);
        },
        permissionsReceived : (sections, action) => {
            sections.sectionPermissions = action.payload;
        },
        permissionCreated : (sections, action) => {
            sections.sectionPermissions.push({
                id: action.payload.data.id,
                perm_section: action.payload.data.perm_section,
                perms_title: action.payload.data.perms_title
            })
        },
        permissionUpdated : (sections, action) => {
            const index = sections.sectionPermissions.findIndex(perm => perm.id == action.payload.data.id);
            sections.sectionPermissions[index].perm_section = action.payload.data.perm_section
            sections.sectionPermissions[index].perms_title = action.payload.data.perms_title
        },
        permissionDeleted : (sections, action) => {
            sections.sectionPermissions = sections.sectionPermissions.filter(perm => perm.id != action.payload.data)
        }
    }
})

export default sectionsSlice.reducer
export const {  
                sectionCreated, 
                sectionUpdated, 
                sectionDeleted, 
                sectionsReceived, 
                permissionsReceived,
                permissionCreated,
                permissionUpdated,
                permissionDeleted } = sectionsSlice.actions

//Action Creator
export const loadSections = () => apiCallBegan(GET_URL_SECTION, sectionsReceived.type, METHOD_GET);
export const createSection = (data:any) => apiCallBegan(`${GET_URL_SECTION}/`, sectionCreated.type, METHOD_POST, data);
export const updateSection = (id:number, data:any) => apiCallBegan(`${GET_URL_SECTION}/${id}/`, sectionUpdated.type, METHOD_PUT, data)
export const deleteSection = (id:number) => apiCallBegan(`${GET_URL_SECTION}/${id}/`, sectionDeleted.type, METHOD_DELETE)

export const loadPermissionsForSection = (id:string | undefined) => apiCallBegan(`${GET_URL_SECTION}/${id}/get-permissions/`, permissionsReceived.type, METHOD_GET);
export const createPermissionForSection = (id:string | undefined, data:any) => apiCallBegan(`api/permissions/${id}/`, permissionCreated.type, METHOD_POST, data);
export const updatePermissionForSection = (id:number, data:any) => apiCallBegan(`api/permissions/${id}/`, permissionUpdated.type, METHOD_PUT, data)
export const deletePermissionForSection = (id:number) => apiCallBegan(`api/permissions/${id}/`, permissionDeleted.type, METHOD_DELETE);