using MyPhotoSpace.Data;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;


namespace MyPhotoSpace
{
    public class PhotoManager
    {
        private uint nextPhotoId = 0;
        private uint nextPhotoAlbumId = 0;
        private static PhotoManager _Instance;
        public static PhotoManager Instance
        {
            get
            {
                if (_Instance == null)
                {
                    _Instance = new PhotoManager();

                }
                return _Instance;
            }
        }
        public List<PhotoAlbumData> PhotoAlbumDatas { get { return DataManager<PhotoAlbumData>.Instance.AllData; } }
        public Dictionary<uint,PhotoData> photoDataMap = new Dictionary<uint,PhotoData>();
        private readonly Dictionary<uint, byte[]> photoMinimaps = new Dictionary<uint, byte[]>();
        public void Init()
        {
            if (PhotoAlbumDatas.Count > 0)
            {
                nextPhotoAlbumId = PhotoAlbumDatas[^1].PhotoAlbumId + 1;

                for (int i = 0; i < PhotoAlbumDatas.Count; i++)
                {
                    PhotoAlbumDatas[i].InitPhotoDataFile();
                   
                    for (int x = 0; x < PhotoAlbumDatas[i].photos.Count; x++)
                    {
                        var photodata = PhotoAlbumDatas[i].photos[x];

                        photoDataMap.Add(photodata.PhotoId, photodata);
                        LoadPhotoMinMap(photodata);
                    }
                    
                }
            
            }

        }
        /// <summary>
        /// 数据锁
        /// </summary>
        public object DataLocker { get { return DataManager<UserInfoData>.Instance.DataLocker; } }
        public PhotoAlbumData CreatPhotoAlbum(string name,uint creatorId)
        {
            PhotoAlbumData photoAlbumData = new PhotoAlbumData() {
                AlbumName = name,
                PhotoAlbumId = nextPhotoAlbumId,
                CreaterId = creatorId,
                CreatTime = DateTime.Now.ToMYTime(),
                FolderName = nextPhotoAlbumId.ToString(),
                photos = new List<PhotoData>(),

            };
            nextPhotoAlbumId++;
            lock (DataLocker)
            {
                PhotoAlbumDatas.Add(photoAlbumData);
                Directory.CreateDirectory(photoAlbumData.FolderPath());
                photoAlbumData.InitPhotoDataFile();
                DataManager<PhotoAlbumData>.Instance.SaveData();
            }
            return photoAlbumData;
        }
        private void LoadPhotoMinMap(PhotoData photoData)
        {
            if (photoData.PhotoId >= nextPhotoId)
            {
                nextPhotoId= photoData.PhotoId+1;
            }
            photoMinimaps[photoData.PhotoId] = File.ReadAllBytes(photoData.MiniMapUrl);

        }
        public  byte[] GetPhotoBtyes(PhotoData photoDataBase, bool beBigPhoto)
        {
            

            if (beBigPhoto)
            {
                return File.ReadAllBytes(photoDataBase.FilePath);
            }
            else
            {
                return photoMinimaps[photoDataBase.PhotoId];
            }


        }
        public PhotoData GetPhotoDataById(uint photoId)
        {
            if (photoDataMap.ContainsKey(photoId))
            {
                return photoDataMap[photoId];
            }
            return null;
        }
        public string UploadNewPhoto(byte[] photoBytes,uint photoAlbumId,uint uploadUserId,string photoName)
        {
            string result = "";
            if(photoBytes==null|| photoBytes.Length <= 0)
            {
                result = "图片数据错误:" + photoBytes==null?"数据不存在":"长度为0";
                return result;
            }
           var photoAlibumData = GetPhotoAlbumdata(photoAlbumId);
            if (photoAlibumData == null)
            {
                result = "没有找到相册,Id="+ photoAlbumId;
                return result;
            }
          var img= PhotoManager.Byte2img(photoBytes);
           var fileExname= PhotoManager.GetImageExt(img);

            PhotoData photoData = new PhotoData()
            {
                CreatTime = DateTime.Now.ToMYTime(),
                PhotoId = nextPhotoId,
                PhotoName = photoName ?? "",
                UploadUserId = uploadUserId,
                FilePath = photoAlibumData.FolderPath() + "/" + nextPhotoId + fileExname,
                MiniMapUrl = photoAlibumData.FolderPath() + "/" + nextPhotoId + "_min"+ fileExname,
                FolderName= photoAlibumData.FolderName,
            };
            nextPhotoId++;

            lock (DataLocker)
            {
                var minByte = CreatMiniPhoto(img, photoData.MiniMapUrl);
                if (minByte == null)
                {
                    minByte = photoBytes;
                }
                photoMinimaps.Add(photoData.PhotoId, minByte);
                File.WriteAllBytes(photoData.FilePath, photoBytes);
                File.WriteAllBytes(photoData.MiniMapUrl, minByte);
                photoAlibumData.photos.Add(photoData);
                photoAlibumData.SavePhotoData();
                photoAlibumData.LastPhotoTime = DateTime.Now.ToMYTime();
                DataManager<PhotoAlbumData>.Instance.SaveData();
                photoDataMap.Add(photoData.PhotoId, photoData);
            }
            return result;
        }
        public PhotoAlbumData GetPhotoAlbumdata(uint photoAlbumId)
        {
            for (int i = 0; i < PhotoAlbumDatas.Count; i++)
            {
                if(PhotoAlbumDatas[i].PhotoAlbumId== photoAlbumId)
                {
                    return PhotoAlbumDatas[i];
                }
            }
            return null;
        }
        private static byte[] CreatMiniPhoto(Image image, string miniPath)
        {
            byte[] returnVar;
            int thumbWidth = 132;    //要生成的缩略图的宽度

            int thumbHeight = 132;
            Bitmap bmp = new Bitmap(thumbWidth, thumbHeight);
           
            //从Bitmap创建一个System.Drawing.Graphics对象，用来绘制高质量的缩小图。
            System.Drawing.Graphics gr = System.Drawing.Graphics.FromImage(bmp);
            gr.Clear(Color.Transparent);
            //设置 System.Drawing.Graphics对象的SmoothingMode属性为HighQuality
            gr.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;

            //下面这个也设成高质量
            gr.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;

            //下面这个设成High
            gr.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High;




            if (image.Width >= image.Height)
            {
                //计算略缩图的起始点和结束点,其他地方用黑色填充
                float rate = ((float)image.Height / ((float)image.Width));
                int height =(int) (thumbWidth * rate);
                int startP = (thumbWidth - height) / 2;
               

                
                System.Drawing.Rectangle rectDestination = new System.Drawing.Rectangle(0, startP, thumbWidth, height);
                gr.DrawImage(image, rectDestination, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel);

            }
            else
            {
                //适配高度的

                float rate = ((float)image.Width / ((float)image.Height));
                int width = (int)(thumbHeight * rate);
                int startP = (thumbHeight - width) / 2;
                


                System.Drawing.Rectangle rectDestination = new System.Drawing.Rectangle(startP, 0, width, thumbHeight);
                gr.DrawImage(image, rectDestination, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel);

            }
           

            for (int i = 0; i < image.PropertyItems.Length; i++)
            {
                var item = image.PropertyItems[i];
                bmp.SetPropertyItem(item);

            }

            //保存图像，大功告成！
            bmp.Save(miniPath);
            MemoryStream bitMapMs = new MemoryStream();
            bmp.Save(bitMapMs, System.Drawing.Imaging.ImageFormat.Jpeg);

            returnVar = bitMapMs.GetBuffer();
            //最后别忘了释放资源
            bmp.Dispose();
            image.Dispose();
            bitMapMs.Dispose();

            return returnVar;
        }

        /// <summary>
        /// 字节数组转换成图片
        /// </summary>
        /// <param name="buffer"></param>
        /// <returns></returns>
        public static Image Byte2img(byte[] buffer)
        {
            MemoryStream ms = new MemoryStream(buffer)
            {
                Position = 0
            };
            Image img = Image.FromStream(ms, true);
            ms.Close();
            return img;
        }

        /// <summary>
        /// 获取图片后缀
        /// </summary>
        /// <param name="image"></param>
        /// <returns></returns>
        public static string GetImageExt(Image image)
        {
            string imageExt = "";
            var RawFormatGuid = image.RawFormat.Guid;
            if (ImageFormat.Png.Guid == RawFormatGuid)
            {
                imageExt = ".png";
            }
            if (ImageFormat.Jpeg.Guid == RawFormatGuid)
            {
                imageExt = ".jpg";
            }
            if (ImageFormat.Bmp.Guid == RawFormatGuid)
            {
                imageExt = ".bmp";
            }
            if (ImageFormat.Gif.Guid == RawFormatGuid)
            {
                imageExt = ".gif";
            }
            if (ImageFormat.Icon.Guid == RawFormatGuid)
            {
                imageExt = ".icon";
            }
            return imageExt;
        }
    }
}
