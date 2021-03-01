using System;
using System.Collections.Generic;
using System.IO;

namespace MyPhotoSpace.Data
{
    public class PhotoAlbumData : DataBase
    {
        public override string DataBaseFilePath()
        {
            return Const.MainDirectory.ToString() + "/PhotoAlbum.txt";
        }
        public override string DefaultData()
        {
            return "[]";
        }
        public string FolderPath()
        {
            return Const.MainDirectory.ToString() + "/" + FolderName;
        }
        public uint PhotoAlbumId { get; set; }
        public string AlbumName { get; set; }
        public string CreatTime { get; set; }
        public uint CreaterId { get; set; }
        public string FolderName { get; set; }
       
       
        /// <summary>
        /// 内含图片的Id列表
        /// </summary>
        public List<PhotoData> photos = new List<PhotoData>();
        /// <summary>
        /// 最后一张照片的上传时间
        /// </summary>
        public string LastPhotoTime { get; set; }

        /// <summary>
        /// 本相册的数据文件地址
        /// </summary>
        /// <returns></returns>
        public string PhotoDataFilePath()
        {
            return FolderPath() + "/Photos.txt";
        }
        public void InitPhotoDataFile()
        {
            if (!Directory.Exists(Const.MainDirectory.ToString()))
            {
                Directory.CreateDirectory(Const.MainDirectory.ToString());
            }
            if (!File.Exists(PhotoDataFilePath()))
            {
                using (var stream = File.Create(PhotoDataFilePath()))
                {

                }
                File.WriteAllText(PhotoDataFilePath(),"[]");
            }
            else
            {
                LoadData();
            }
           
        }
        private void LoadData()
        {
            if (File.Exists(PhotoDataFilePath()))
            {
                var dataStr = File.ReadAllText(PhotoDataFilePath());
                if (string.IsNullOrEmpty(dataStr) || string.IsNullOrWhiteSpace(dataStr))
                {
                    throw new Exception("以下文件无数据内容: " + PhotoDataFilePath());
                }
                else
                {
                    photos = Newtonsoft.Json.JsonConvert.DeserializeObject<List<PhotoData>>(dataStr);

                }


                
            }
            else
            {
                throw new Exception("没有找到相册的数据文件,储存路径: " + PhotoDataFilePath());
            }
        }
        public void SavePhotoData()
        {
           
            if (File.Exists(PhotoDataFilePath()))
            {
                var dataStr = Newtonsoft.Json.JsonConvert.SerializeObject(this.photos);


                File.WriteAllText(PhotoDataFilePath(), dataStr);
            }
            else
            {
                throw new Exception("没有找到相册的数据文件,储存路径: " + PhotoDataFilePath());
            }
        }

    }
    public class PhotoData
    {
        public uint PhotoId { get; set; }
        public uint UploadUserId { get; set; }
        public string PhotoName { get; set; }
        public string CreatTime { get; set; }
        public string FilePath { get; set; }
        public string MiniMapUrl { get; set; }
        public string FolderName { get; set; }

        public string DataBaseFilePath()
        {
            return Const.MainDirectory.ToString() + "/" + FolderName + "/Photos.txt";
        }

    }
}
