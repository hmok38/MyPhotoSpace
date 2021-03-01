export enum HMFWEvent {
    /**登录失败或者过期 */
    E_LOGOUT = "E_LOGOUT",
    /**登录成功 */
    E_LOGIN = "E_LOGIN",
    /**遮蔽UI被打开 */
    E_CoveUIVisable = "E_CoveUIVisable",
    /**遮蔽UI被关闭 */
    E_CoveUIDisable = "E_CoveUIDisable",
}

export enum DataCenterKey {
    /**用户信息 */
    UserData = "UserData",
    /**相册信息 */
    AlbumDatas = "AlbumDatas",
    /**照片数据 */
    PhotoData = "PhotoData",
}