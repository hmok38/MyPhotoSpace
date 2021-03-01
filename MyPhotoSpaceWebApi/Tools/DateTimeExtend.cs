using System;


public static class DateTimeExtend
{
    /// <summary>
    /// 按照"yyyy/MM/dd_HH:mm:ss:fff" 转换时间
    /// </summary>
    /// <param name="dateTime"></param>
    /// <returns></returns>
    public static string ToMYTime(this DateTime dateTime)
    {
        return dateTime.ToString("yyyy/MM/dd HH:mm:ss");
    }


    
}

