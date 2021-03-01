using System;
using System.Collections.Generic;
using System.IO;

namespace MyPhotoSpace.Data
{
    public class DataManager<T> where T : DataBase
    {
        public readonly object DataLocker=new object();
        private static DataManager<T> _Instance;
        public static DataManager<T> Instance
        {
            get
            {
                if (_Instance == null)
                {
                    _Instance = new DataManager<T>();
                }
                return _Instance;
            }
        }

        public List<T> AllData = new List<T>();
      
        public void Init()
        {
           
            var defult = System.Activator.CreateInstance<T>();
            defult.InitDatabase();
            loadData(defult);
        }
        private bool loadData(T data)
        {
            
            if (File.Exists(data.DataBaseFilePath()))
            {
                var dataStr = File.ReadAllText(data.DataBaseFilePath());
                if(string.IsNullOrEmpty(dataStr)||string.IsNullOrWhiteSpace(dataStr))
                {
                    throw new Exception("以下文件无数据内容: " + data.DataBaseFilePath());
                }
                else
                {
                    this.AllData = Newtonsoft.Json.JsonConvert.DeserializeObject<List<T>>(dataStr);
                    
                }
               

                return true;
            }
            else
            {
                throw new Exception("没有找到" + data.GetType().Name + " 储存路径: " + data.DataBaseFilePath());
            }
           
        }
        public void SaveData()
        {
            var defult = System.Activator.CreateInstance<T>();
            if (File.Exists(defult.DataBaseFilePath()))
            {
                var dataStr = Newtonsoft.Json.JsonConvert.SerializeObject(this.AllData);


                File.WriteAllText(defult.DataBaseFilePath(), dataStr);
            }
            else
            {
                throw new Exception("没有找到" + defult.GetType().Name + " 储存路径: "+ defult.DataBaseFilePath());
            }
        }
    }
}
