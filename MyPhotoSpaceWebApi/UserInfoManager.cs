using MyPhotoSpace.Data;

using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace MyPhotoSpace
{
    public class UserInfoManager
    {

        private uint nextId = 0;
        private static UserInfoManager _Instance;
        public static UserInfoManager Instance
        {
            get
            {
                if (_Instance == null)
                {
                    _Instance = new UserInfoManager();
                   
                }
                return _Instance;
            }
        }
        public void Init()
        {
            //字典排序
            UserInfoMaps.Sort((x, y) => { return (int)(x.UserId - y.UserId); });
            if (UserInfoMaps.Count > 0)
            {
                nextId = UserInfoMaps[^1].UserId + 1;
            }
            
        }
        public List<UserInfoData> UserInfoMaps { get { return DataManager<UserInfoData>.Instance.AllData; } }
        /// <summary>
        /// 数据锁
        /// </summary>
        public object DataLocker { get { return DataManager<UserInfoData>.Instance.DataLocker; } }
        
        public UserInfoData GetUserInfo(string username)
        {
            for (int i = 0; i < UserInfoMaps.Count; i++)
            {
                if (UserInfoMaps[i].Username == username)
                {
                    return UserInfoMaps[i];
                }
            }
            return null;
        }
        public UserInfoData GetUserInfo(uint userId)
        {
            for (int i = 0; i < UserInfoMaps.Count; i++)
            {
                if (UserInfoMaps[i].UserId == userId)
                {
                    return UserInfoMaps[i];
                }
            }
            return null;
        }

        public bool  CreatUserInfo(string userName,string nickName,string password ,out UserInfoData userInfoData)
        {
            if( BeValidForUserName(userName) && BeValidForPassword(password)&& !BeRepeatUserName(userName))
            {
                lock (DataLocker)
                {
                    var userId = nextId;
                    userInfoData = new UserInfoData()
                    {
                        Username = userName,
                        NickName = nickName,
                        Password = password,
                        UserId = userId,
                        LastLoginIp="UnKonw",
                         LastLoginTime=""
                    };
                    nextId++;
                    UserInfoMaps.Add(userInfoData);
                }
                
                return true;


            }
            else
            {
                userInfoData = null;
                return false;

            }
           
        }

        private static readonly Regex userNameRegex = new Regex("^[0-9a-zA-z_]{3,20}$");
        private static readonly Regex passwordRegex = new Regex(@"^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,20}$");
        /// <summary>
        /// 用户名是否合法
        /// </summary>
        /// <param name="createUserInfoModel"></param>
        /// <returns></returns>
        public static bool BeValidForUserName(string userName)
        {

            return userNameRegex.IsMatch(userName);
        }
        /// <summary>
        /// 密码是否合法
        /// </summary>
        /// <param name="createUserInfoModel"></param>
        /// <returns></returns>
        public static bool BeValidForPassword(string password)
        {
            return passwordRegex.IsMatch(password);
        }
        /// <summary>
        /// 是否重复的用户名
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public  bool BeRepeatUserName(string userName)
        {
            return GetUserInfo(userName) != null;
        }
        private static void SaveToDb()
        {
            DataManager<UserInfoData>.Instance.SaveData();
        }
        public bool EditUserPassword(uint userId,string password, out UserInfoData userInfoData)
        {
             var userInfo= GetUserInfo(userId);
            if (BeValidForPassword(password)&& userInfo!=null)
            {
                lock (DataLocker)
                {
                    userInfo.Password = password;
                    SaveToDb();
                }
                userInfoData = userInfo;
                return true;
            }
            userInfoData = userInfo;
            return false;
        }
        public bool EditUserNickName(uint userId, string nickName,out UserInfoData userInfoData )
        {
            var userInfo = GetUserInfo(userId);
            if (!string.IsNullOrEmpty(nickName)&&!string.IsNullOrWhiteSpace(nickName) && userInfo != null)
            {
                lock (DataLocker)
                {
                    userInfo.NickName = nickName;
                    SaveToDb();
                }
                userInfoData = userInfo;
                return true;
            }
            userInfoData = null;
            return false;
        }
    }
}
