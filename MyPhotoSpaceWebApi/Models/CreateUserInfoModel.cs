using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyPhotoSpace.Models
{
    /// <summary>
    /// 创建用户模型
    /// </summary>
    public class CreateUserInfoModel
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public string NickName { get; set; }

       
    }
}
