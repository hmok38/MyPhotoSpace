using MyPhotoSpace.Data;

namespace MyPhotoSpace.Models
{
    public class AlbumInfoModel
    {
        public AlbumInfoModel()
        {

        }
        public AlbumInfoModel(PhotoAlbumData photoAlbumData, string createrUserName)
        {
            AlbumName = photoAlbumData.AlbumName;
            CreaterUser = createrUserName ?? "";
            CreatTime = photoAlbumData.CreatTime;
            LastPhotoTime = photoAlbumData.LastPhotoTime??"";
            PhotoAlbumId = photoAlbumData.PhotoAlbumId;
            PhotoIds =new uint[ photoAlbumData.photos.Count];
            for (int i = 0; i < photoAlbumData.photos.Count; i++)
            {
                
                PhotoIds[i] = photoAlbumData.photos[i].PhotoId;
            }
        }


        public uint PhotoAlbumId { get; set; }
        public string AlbumName { get; set; }
        public string CreatTime { get; set; }
        public string CreaterUser { get; set; }
        public uint[]  PhotoIds { get; set; }
        public string LastPhotoTime { get; set; }
    }
}
