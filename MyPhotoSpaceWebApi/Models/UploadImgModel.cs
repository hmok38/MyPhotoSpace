using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyPhotoSpace.Models
{
    public class UploadImgModel
    {
        public uint PhotoAlbumId { get; set; }
        public string Name { get; set; }
        public string File { get; set; }
    }
}
