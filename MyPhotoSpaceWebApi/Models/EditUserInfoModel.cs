namespace MyPhotoSpace.Models
{
    public class EditUserInfoModel
    {
        /// <summary>
        /// 必传
        /// </summary>
        public string Password { get; set; }
        /// <summary>
        /// 修改密码传这个
        /// </summary>
        public string NewPassword { get; set; }
        /// <summary>
        /// 修改昵称传这个
        /// </summary>
        public string NewNickName { get; set; }

    }
}
