<?php
//$data = 'H4sIAAAAAAAAC6WXUZLkIAiGL5StEgWV2qc5wxzAA8wV9vDbielEvumprtp9if3_AiIi0l-fpW8yNI08JNsoI5sNkTnkOUyyDkkpjTZkiO2fPtLoQ_7IOLRTfqst_6qt45dME_7SxC4zFd65kMeu-n829KX-Hr6nfnq3DfvRjfTeidtM_cHM9vUhZUv7YHOoc9Dt8Z2_22TOoe_DZ_ED5eM7DRwTH3p856ykOciWfssmW95yt61sYicsEqEGqCXCGqEHaPmCfYcWZ3uYrRJhXLe2AFuKMHrVbq8eE3nrhx_5CV0C3A804Iz5gnm9zdUdW4yYtBhQ6ZjvcWvZDRgHknAiSYEbDjABF-AaIl3EI84ZOPpXmDDMmCVlDn3FestJHwEt8_jyU79jvY71HOs51vMWsKYEjBxOS7r4QRwBqReWDGxPfOhL9E8L7BdckhJviWqMt6oBx4uiJsC4ohbzQWsChn8d8XLEywswLz1ufcrAuPcpxstEgBU4-mfFgGN8zCrw4l_ZiXYs-FhlL7NXNTq0NFkkSiOhJATE436AMBL5JhC8iRX4cqLi8td5-RX4drLOanAbOKtBuokZrnITTiLFfZ7Evc_T6HfCsMpKOIiz7BQQq4S9JJa9nKWJxOLYWawSiGVzs3ytRHspsdpoIOYzuagoQ6j1pcQ3GytRSTg2pzw5YwiNIZyv8ErwGM5nu0BlIWZBX2ycFX6RUEooJRolGiTmm79INOZYY46dbUKBykow-RvTsjGmnTHtjGlnCPsawryI-N3QxKLaUqwLTTKwAcei2rIAKzAaqsKOKhb9VipwbBqawj-Ffwr_0DQ1PGLNYtFvNQGz5UP8KuLX4J9jvw57jv163G_HI9fxyPXlkTt70NhF9hKb0q4a8XzFblx7xB32HE1uuuzt_jiaOEcT52jiHH2_l5gvrgk45ouj6XON8XOL8XP8OXCDfxX-4f-B15gv3hIw_GsxX7zFfPEO_66m9C_bF5V-dQ8AAA==';
//$data = 'H4sIAAAAAAAACzPQMzK2NrQ20DO2sAaSJhCOuZG1taGesRGQY6hnagLimAPlAX7Z9MctAAAA';
$data = 'H4sIAAAAAAAAC6WQ0Q3CMAxEFzKSz4nTVHx1hg5wA3QFhqeJCR_QChA_d_HZfrKyrakKmJVGmDPR3AmEWViEmRewEKrKiSC8SaWyEjewI9S-Q-B_xHyIaDOx8BXE2PaPQO03Bkg_YfwUo79cU04wsi1Ios08rIRl2TXeUyQPq83WNPfKugagN5bcNbrQMIheIVVMkFySwEdZohSD7EfmEc9vcSrP8Wlsm72M3QHc2ZxWcwIAAA==';
$data1 = str_replace("_","/",$data);
$data2 = str_replace("-","+",$data1);
$decode = zlib_decode(base64_decode($data2));
echo $decode;
?>