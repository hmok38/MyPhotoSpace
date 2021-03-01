using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MyPhotoSpace.Data
{
    public abstract class DataBase
    {
        /// <summary>
        /// 实现数据源文件地址
        /// </summary>
        /// <returns></returns>
        public abstract string DataBaseFilePath();

        public  void InitDatabase()
        {
            if (!Directory.Exists(Const.MainDirectory.ToString()))
            {
                Directory.CreateDirectory(Const.MainDirectory.ToString());
            }
            if (!File.Exists(DataBaseFilePath()))
            {
                using (var stream = File.Create(DataBaseFilePath()))
                {
                   
                }
                File.WriteAllText(DataBaseFilePath(), DefaultData());
            }

        }
        public virtual string DefaultData()
        {
            return "[]";
        }
    }
}
