using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyPhotoSpace.Data;
using MyPhotoSpace.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Linq;


namespace MyPhotoSpace.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public AuthController()
        {

        }
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Post([FromBody] LoginModel loginInfo)
        {

            IPAddress iPAddress = HttpContext.Connection.RemoteIpAddress;
            if (AuthController.CheckPassword(loginInfo, out UserInfoData userInfoData))
            {

                //Generate Token
                var token = GenerateJWT(userInfoData.UserId);

                string userInfoStr = Newtonsoft.Json.JsonConvert.SerializeObject(userInfoData);

                var resultData = Ok(new
                {
                    message = "ok",
                    data = new
                    {
                        userInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<UserInfoData>(userInfoStr),
                        token
                    }
                });

                if (iPAddress != null)
                {
                    userInfoData.LastLoginIp = iPAddress.ToString();

                }
                else
                {
                    userInfoData.LastLoginIp = "unkown";

                }

                userInfoData.LastLoginTime = DateTime.Now.ToMYTime();

                return resultData;

            }
            else
            {
                return BadRequest(new { message = "用户名或密码错误" });
            }
        }

        [Authorize]
        [HttpPost("CreateUser")]
        public IActionResult CreatNewUser([FromBody] CreateUserInfoModel createUserInfo)
        {

            if (UserInfoManager.Instance.CreatUserInfo(createUserInfo.Username, createUserInfo.NickName, createUserInfo.Password, out UserInfoData userInfo))
            {
                return Ok(new { messager = "Ok", data = new { userInfo.UserId, UserName = createUserInfo.Username, createUserInfo.NickName } });
            }


            return BadRequest(new { messager = "用户名或密码不符合规则" });
        }

        [Authorize]
        [HttpPost("EditUser")]
        public IActionResult EditUserInfo([FromBody] EditUserInfoModel editUserInfoModel)
        {
            var auth = HttpContext.AuthenticateAsync();
            var userIdstr = auth.Result.Principal.Claims.First(t => t.Type.Equals(ClaimTypes.NameIdentifier))?.Value;
            if (!uint.TryParse(userIdstr, out uint userId))
            {
                return BadRequest(new { messager = "权限查找失败,ID解析失败=" + userId });
            }


            UserInfoData userInfo = UserInfoManager.Instance.GetUserInfo(userId);
            if (userInfo == null)
            {
                return BadRequest(new { messager = "权限查找失败,找不到ID=" + userId + " 的用户" });
            }
            if (userInfo.Password != editUserInfoModel.Password)
            {
                return BadRequest(new { messager = "请输入正确的密码" });
            }

            if (!string.IsNullOrEmpty(editUserInfoModel.NewNickName) && !string.IsNullOrWhiteSpace(editUserInfoModel.NewNickName))
            {
                if (UserInfoManager.Instance.EditUserNickName(userId, editUserInfoModel.NewNickName, out userInfo))
                {
                    return Ok(new { messager = "Ok", data = new { userInfo.UserId, userInfo.NickName } });
                }
                else
                {
                    return BadRequest(new { messager = "昵称修改失败" });
                }
            }


            if (UserInfoManager.Instance.EditUserPassword(userId, editUserInfoModel.NewPassword, out userInfo))
            {
                return Ok(new { messager = "Ok", data = new { userInfo.UserId, userInfo.Password } });
            }
            else
            {
                return BadRequest(new { messager = "密码修改失败,密码需由大写小写字母加数字组成的6-20位字符组成" });
            }





        }
        /// <summary>
        /// 本系统采用5分钟无操作即取消授权的机制,那么每次调用接口后会给客户端一次新的token
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static string RefreshJWTToken(uint userId)
        {
            return GenerateJWT(userId);
        }
        private static string GenerateJWT(uint userId)
        {
            var claims = new[]
               {
                    new Claim(JwtRegisteredClaimNames.Nbf,$"{new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()}") ,
                    new Claim (JwtRegisteredClaimNames.Exp,$"{new DateTimeOffset(DateTime.Now.AddMinutes(5)).ToUnixTimeSeconds()}"),
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Const.SecurityKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: Const.Domain,
                audience: Const.Domain,
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: creds);
            // 将token变为string
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return jwtToken;
        }
        internal static bool CheckPassword(LoginModel loginInfo, out UserInfoData userInfoData)
        {
            if (loginInfo != null && !string.IsNullOrEmpty(loginInfo.Username) && !string.IsNullOrEmpty(loginInfo.Password))
            {
                var userInfo = UserInfoManager.Instance.GetUserInfo(loginInfo.Username);
                if (userInfo != null && userInfo.Password == loginInfo.Password)
                {
                    userInfoData = userInfo;
                    return true;
                }


            }
            userInfoData = null;
            return false;


        }
    }
}
