using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyPhotoSpace.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;

namespace MyPhotoSpace.Controllers
{
    [Route("api/Photo")]
    [ApiController]
    public class PhotoControl : ControllerBase
    {
        [Authorize]
        [HttpPost("GetPhotoAlbums")]
       public IActionResult PostGetPhotoAlbums()
        {
            //var  dataStr  =JsonConvert.SerializeObject(PhotoManager.Instance.photoAlbumDatas);

            //var data= JsonConvert.SerializeObject(DataManager.Instance.photoAlbumMap);

           

            return Ok(new { message = "ok",data = GetAllAlbumInfoModels() });
        }
        [Authorize]
        [HttpPost("CreatPhotoAlbum")]
        public IActionResult PostCreatPhotoAlbum([FromBody] CreatPhotoAlbumModel creatPhotoAlbumModel)
        {
            var auth = HttpContext.AuthenticateAsync();
            var userIdstr = auth.Result.Principal.Claims.First(t => t.Type.Equals(ClaimTypes.NameIdentifier))?.Value;
            if (!uint.TryParse(userIdstr, out uint userId))
            {
                return BadRequest(new { messager = "权限查找失败,ID解析失败=" + userId });
            }
            var album = PhotoManager.Instance.CreatPhotoAlbum(creatPhotoAlbumModel.Name, userId);
            
            return Ok(new { message = "ok",data= GetAllAlbumInfoModels() });
        }
        [Authorize]
        [HttpPost("UploadPhoto")]
        public IActionResult PostUpLoadPhoto([FromBody] UploadImgModel uploadImgModel)
        {


            var auth = HttpContext.AuthenticateAsync();
            var userIdstr = auth.Result.Principal.Claims.First(t => t.Type.Equals(ClaimTypes.NameIdentifier))?.Value;
            if (!uint.TryParse(userIdstr, out uint userId))
            {
                return BadRequest(new { messager = "权限查找失败,ID解析失败=" + userId });
            }
            if (uploadImgModel.File == null || uploadImgModel.File.Length <= 0)
            {
                return BadRequest(new { messager = "收到的文件为空" });
            }

            byte[] fileBytes = Convert.FromBase64String(uploadImgModel.File);


            var result = PhotoManager.Instance.UploadNewPhoto(fileBytes, uploadImgModel.PhotoAlbumId, userId, uploadImgModel.Name);
            if (result == "")
            {
                var user = UserInfoManager.Instance.GetUserInfo(userId);
                var albumInfo = PhotoManager.Instance.GetPhotoAlbumdata(uploadImgModel.PhotoAlbumId);
                AlbumInfoModel albumInfo2 = new AlbumInfoModel(albumInfo, user != null ? user.Username : "");
                return Ok(new { message = "ok", data = albumInfo2 });
            }
            else
            {
                return BadRequest(new { message = result });
            }

        }

        [Authorize]
        [HttpPost("GetPhoto")]
        public IActionResult PostGetPhoto([FromBody] GetPhotoModel getPhotoModel)
        {
            var photoDataBase = PhotoManager.Instance.GetPhotoDataById(getPhotoModel.PhotoId);
            if (photoDataBase == null)
            {
                return    BadRequest(new { message = "图片ID错误Id="+ getPhotoModel.PhotoId });
            }
            var bytes=  PhotoManager.Instance.GetPhotoBtyes(photoDataBase, getPhotoModel.BeBig);
            if (bytes == null && bytes.Length <= 0)
            {
                return BadRequest(new { message = "未请求到正确的数据 ,Id=" + getPhotoModel.PhotoId });
            }
            string s = Convert.ToBase64String(bytes);
           // new FileContentResult(bytes, "image/jpeg");
            var upUser= UserInfoManager.Instance.GetUserInfo(photoDataBase.UploadUserId);
            string photoUserName = upUser!=null?upUser.NickName:"未知";
            return Ok(new { message = "ok", data=new { photoDataBase.PhotoId, photoDataBase.PhotoName, photoDataBase.CreatTime, photoUserName, photoData = s } }); 
        }
       
        private static List<AlbumInfoModel> GetAllAlbumInfoModels()
        {
            List<AlbumInfoModel> infos = new List<AlbumInfoModel>();
            for (int i = 0; i < PhotoManager.Instance.PhotoAlbumDatas.Count; i++)
            {
                var temp = PhotoManager.Instance.PhotoAlbumDatas[i];
                var user = UserInfoManager.Instance.GetUserInfo(temp.CreaterId);

                AlbumInfoModel albumInfo = new AlbumInfoModel(temp, user != null ? user.Username : "");

                infos.Add(albumInfo);
            }
            return infos;
        }
    }
}
