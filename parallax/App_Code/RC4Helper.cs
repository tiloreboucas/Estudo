using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RC4
{

    /// <summary>
    /// Conversion into c# of the JQuery rc4 Encryption in JQuery.rc4.js Code
    /// Robert Bertora Nov 2010
    /// </summary>

    public class RC4Helper
    {

        private static string GetKey(int ClientId)
        {
            return ((((ClientId % 2 == 0) ? (Math.Sqrt(ClientId) + (ClientId / Math.Sqrt(ClientId * Int32.Parse(ClientId.ToString()[0].ToString())))).ToString("N10") + "MOD" : (Math.Sqrt(ClientId) + (ClientId / Math.Sqrt(ClientId * (Int32.Parse(ClientId.ToString()[0].ToString()) + 1)))).ToString().Split(',').Length.ToString()) == "1") ? "Un" + ClientId + "d&f" + ClientId + "1n3D" : (ClientId % 2 == 0) ? (Math.Sqrt(ClientId) + (ClientId / Math.Sqrt(ClientId * Int32.Parse(ClientId.ToString()[0].ToString())))).ToString("N10") + "MOD" : (Math.Sqrt(ClientId) + (ClientId / Math.Sqrt(ClientId * (Int32.Parse(ClientId.ToString()[0].ToString()) + 1)))).ToString("N10").Split(',')[1]).Replace(',', '.');
        }

        public static string Encrypt(int id, string text)
        {
            string key = GetKey(id);

            RC4 rc4 = new RC4(key, text);
            return RC4.StrToHexStr(rc4.EnDeCrypt()).ToLower();


        }

        public static string Decrypt(int id, string text)
        {
            string key = GetKey(id);

            RC4 rc4 = new RC4(key, RC4.HexStrToStr(text));

            return rc4.EnDeCrypt();

        }
    }
}

//////////////////////////////////////////////////////