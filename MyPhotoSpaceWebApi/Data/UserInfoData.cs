using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;

namespace MyPhotoSpace.Data
{
    public class UserInfoData : DataBase
    {
        public override string DataBaseFilePath()
        {
            return Const.MainDirectory.ToString() + "/UserInfoData.txt";
        }
        public override string DefaultData()
        {
            return "[{\"UserId\":0,\"Username\":\"Admin\",\"Password\":\"Admin\",\"NickName\":\"管理员\",\"lastLoginIp\":\"unkonw\",\"lastLoginTime\":\"\"}]";
        }
        public uint UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
       
        public string NickName { get; set; }

        public string LastLoginIp { get; set; }

        public string LastLoginTime { get; set; }

       
    }
}
