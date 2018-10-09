<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/2/1
 * Time: 12:06
 */

namespace App\Util;


class UUID {
    public static function v3($namespace, $name) {
        if(!self::is_valid($namespace)) return false;

        $nhex = str_replace(array('-','{','}'), '', $namespace);

        $nstr = '';

        for($i = 0; $i < strlen($nhex); $i+=2) {
            $nstr .= chr(hexdec($nhex[$i].$nhex[$i+1]));
        }

        $hash = md5($nstr . $name);

        return sprintf('%08s-%04s-%04x-%04x-%12s',

            substr($hash, 0, 8),

            substr($hash, 8, 4),

            (hexdec(substr($hash, 12, 4)) & 0x0fff) | 0x3000,

            (hexdec(substr($hash, 16, 4)) & 0x3fff) | 0x8000,

            substr($hash, 20, 12)
        );
    }

    public static function v4() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

            mt_rand(0, 0xffff), mt_rand(0, 0xffff),

            mt_rand(0, 0xffff),

            mt_rand(0, 0x0fff) | 0x4000,

            mt_rand(0, 0x3fff) | 0x8000,

            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    public static function v5($namespace, $name) {
        if(!self::is_valid($namespace)) return false;
        $nhex = str_replace(array('-','{','}'), '', $namespace);
        $nstr = '';
        for($i = 0; $i < strlen($nhex); $i+=2) {
            $nstr .= chr(hexdec($nhex[$i].$nhex[$i+1]));
        }
        $hash = sha1($nstr . $name);
        return sprintf('%08s-%04s-%04x-%04x-%12s',
            substr($hash, 0, 8),substr($hash, 8, 4),
            (hexdec(substr($hash, 12, 4)) & 0x0fff) | 0x5000,
            (hexdec(substr($hash, 16, 4)) & 0x3fff) | 0x8000,
            substr($hash, 20, 12));
    }

    public static function is_valid($uuid) {
        return preg_match('/^\{?[0-9a-f]{8}\-?[0-9a-f]{4}\-?[0-9a-f]{4}\-?'.
                '[0-9a-f]{4}\-?[0-9a-f]{12}\}?$/i', $uuid) === 1;
    }
}


//$v3uuid = UUID::v3('1546058f-5a25-4334-85ae-e68f2a44bbaf', 'SomeRandomString');
//$v5uuid = UUID::v5('1546058f-5a25-4334-85ae-e68f2a44bbaf', 'SomeRandomString');

// Pseudo-random UUID

//$v4uuid = UUID::v4();
?>