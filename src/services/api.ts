import axios from 'services/axios.customize'

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return (
        axios.post<IBackendRes<ILogin>>(urlBackend, { username, password })
    )
}

export const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "api/v1/user/register";
    return (
        axios.post<IBackendRes<IRegister>>(urlBackend, { fullName, email, password, phone })
    )
}

export const fetchAccountAPI = () => {
    const urlBackend = "api/v1/auth/account";
    return (
        axios.get<IBackendRes<IFetchAccount>>(urlBackend)
    )
}

export const logoutAPI = () => {
    const urlBackend = "api/v1/auth/logout";
    return (
        axios.post<IBackendRes<IFetchAccount>>(urlBackend)
    )
}

export const getUsersAPI = (query: string) => {
    const urlBackend = `api/v1/user?${query}`;
    return (
        axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
    )
}

export const createUserAPI = (fullName: string, email: string, password: string, phone: string) => {
    const urlBackend = "api/v1/user";
    return (
        axios.post<IBackendRes<IUserTable>>(urlBackend, { fullName, email, password, phone })
    )
}

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `api/v1/user/${_id}`;
    return (
        axios.delete<IBackendRes<IDeleteUser>>(urlBackend)
    )
}

export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackend = "api/v1/user";
    return (
        axios.put<IBackendRes<IRegister>>(urlBackend, { _id, fullName, phone })
    )
}

export const ImportUsersAPI = (users: IDataImport[]) => {
    const urlBackend = "api/v1/user/bulk-create";
    return (
        axios.post<IBackendRes<IDataImport[]>>(urlBackend, users)
    )
}

export const getBooksAPI = (query: string) => {
    const urlBackend = `api/v1/book?${query}`;
    return (
        axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend)
    )
}

export const fetchCategoryAPI = () => {
    const urlBackend = "api/v1/database/category";
    return (
        axios.get<IBackendRes<string[]>>(urlBackend)
    )
}

export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return (
        axios<IBackendRes<{
            fileUploaded: string
        }>>({
            method: 'post',
            url: 'api/v1/file/upload',
            data: bodyFormData,
            headers: {
                "Content-type": "multipart/form-data",
                "upload-type": folder
            },
        })
    )
}

export const createBookAPI = (thumbnail: string, slider: string[], mainText: string, author: string, price: number, sold: number, quantity: number, category: string) => {
    const urlBackend = "api/v1/book";
    return (
        axios.post<IBackendRes<IBookTable>>(urlBackend, { thumbnail, slider, mainText, author, price, sold, quantity, category })
    )
}

export const deleteBookAPI = (_id: string) => {
    const urlBackend = `api/v1/book/${_id}`;
    return (
        axios.delete<IBackendRes<IDeleteUser>>(urlBackend)
    )
}