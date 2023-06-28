import React from 'react';
import "./AdminDashboard.css";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

const AdminDashboard = (props) => {

//수정

const handle = {

  padClick: (data) => {
      console.log(data);
  },

  legendClick: (data) => {
      console.log(data);
  },
};


//수정2
const handle2 = {
  barClick: (data) => {
      console.log(data);
  },

  legendClick: (data) => {
      console.log(data);
  },
}

const {params} = props;


   console.log('ㅎㅎ',props);

   

    const [userCount,productCount,Products] = params;
    console.log(userCount);
    console.log(productCount);
    console.log(Products);



   // 각 카테고리별 제품 수 계산
   const categoryCounts = Products.reduce((counts, product) => {
    const { category } = product;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  console.log(categoryCounts);


// 각 카테고리별 active 값 계산
const categoryActiveCounts = Products.reduce((counts, product) => {
    const { category, soldout } = product;
    if (counts[category]) {
      counts[category].trueCount += soldout ? 1 : 0;
      counts[category].falseCount += soldout ? 0 : 1;
    } else {
      counts[category] = {
        trueCount: soldout ? 1 : 0,
        falseCount: soldout ? 0 : 1,
      };
    }
    return counts;
  }, {});
  
  console.log(categoryActiveCounts);
  
  // clothing 카테고리의 trueCount 값 출력

 //의류 카테고리 판매중 판매완료갯수
  const clothingTrue = categoryActiveCounts.clothing ? categoryActiveCounts.clothing.trueCount : 0
  const clothingFalse = categoryActiveCounts.clothing ? categoryActiveCounts.clothing.falseCount : 0

  console.log('의류true'+clothingTrue);
  console.log('의류false'+clothingFalse);

   //가전제품 카테고리 판매중 판매완료갯수
   const electronicsTrue = categoryActiveCounts.electronics ? categoryActiveCounts.electronics.trueCount : 0
   const electronicsFalse = categoryActiveCounts.electronics ? categoryActiveCounts.electronics.falseCount : 0
 
   console.log('가전제품true'+electronicsTrue);
   console.log('가전제품false'+electronicsFalse);

    //의류 카테고리 판매중 판매완료갯수
  const furnitureAndInteriorTrue = categoryActiveCounts.furnitureAndInterior ? categoryActiveCounts.furnitureAndInterior.trueCount : 0
  const furnitureAndInteriorFalse = categoryActiveCounts.furnitureAndInterior ? categoryActiveCounts.furnitureAndInterior.falseCount : 0

  console.log('가구true'+furnitureAndInteriorTrue);
  console.log('가구false'+furnitureAndInteriorFalse);

   //자동차 카테고리 판매중 판매완료갯수
   const automotiveTrue = categoryActiveCounts.automotive ? categoryActiveCounts.automotive.trueCount : 0
   const automotiveFalse = categoryActiveCounts.automotive ? categoryActiveCounts.automotive.falseCount : 0
 
   console.log('자동차true'+automotiveTrue);
   console.log('자동차false'+automotiveFalse);

    //스포츠 카테고리 판매중 판매완료갯수
  const sportsAndLeisureTrue = categoryActiveCounts.sportsAndLeisure ? categoryActiveCounts.sportsAndLeisure.trueCount : 0
  const sportsAndLeisureFalse = categoryActiveCounts.sportsAndLeisure ? categoryActiveCounts.sportsAndLeisure.falseCount : 0

  console.log('스포츠true'+sportsAndLeisureTrue);
  console.log('스포츠false'+sportsAndLeisureFalse);

   //아동용품 카테고리 판매중 판매완료갯수
   const kidsItemsTrue = categoryActiveCounts.kidsItems ? categoryActiveCounts.kidsItems.trueCount : 0
   const kidsItemsFalse = categoryActiveCounts.kidsItems ? categoryActiveCounts.kidsItems.falseCount : 0
 
   console.log('아동용품true'+kidsItemsTrue);
   console.log('아동용품false'+kidsItemsFalse);

    //도서 카테고리 판매중 판매완료갯수
  const booksAndStationeryTrue = categoryActiveCounts.booksAndStationery ? categoryActiveCounts.booksAndStationery.trueCount : 0
  const booksAndStationeryFalse = categoryActiveCounts.booksAndStationery ? categoryActiveCounts.booksAndStationery.falseCount : 0

  console.log('도서true'+booksAndStationeryTrue);
  console.log('도서false'+booksAndStationeryFalse);

   //신발 카테고리 판매중 판매완료갯수
   const shoesTrue = categoryActiveCounts.shoes ? categoryActiveCounts.shoes.trueCount : 0
   const shoesFalse = categoryActiveCounts.shoes ? categoryActiveCounts.shoes.falseCount : 0
 
   console.log('신발true'+shoesTrue);
   console.log('신발false'+shoesFalse);

    //악세서리 카테고리 판매중 판매완료갯수
  const accessoriesAndJewelryTrue = categoryActiveCounts.accessoriesAndJewelry ? categoryActiveCounts.accessoriesAndJewelry.trueCount : 0
  const accessoriesAndJewelryFalse = categoryActiveCounts.accessoriesAndJewelry ? categoryActiveCounts.accessoriesAndJewelry.falseCount : 0

  console.log('악세서리true'+accessoriesAndJewelryTrue);
  console.log('악세서리false'+accessoriesAndJewelryFalse);

   //화장품 카테고리 판매중 판매완료갯수
   const beautyAndCosmeticsTrue = categoryActiveCounts.beautyAndCosmetics ? categoryActiveCounts.beautyAndCosmetics.trueCount : 0
   const beautyAndCosmeticsFalse = categoryActiveCounts.beautyAndCosmetics ? categoryActiveCounts.beautyAndCosmetics.falseCount : 0
 
   console.log('화장품true'+beautyAndCosmeticsTrue);
   console.log('화장품false'+beautyAndCosmeticsFalse);

    return (
        <div id="totalDashboard">

            {/* <div id = "userCount">
                   <p>총 유저수</p>
                   <h1>{userCount}</h1>
                
            </div> 

            <div id = "productCount">
                    <p>총 제품수</p>
                    <h1>{productCount}</h1>
            </div> */}



            <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
            <ResponsivePie
                /**
                 * chart에 사용될 데이터
                 */
                data={[
                    { id: '의류', value: categoryCounts.clothing },
                    { id: '가전제품', value: categoryCounts.electronics },
                    { id: '가구/인테리어', value:categoryCounts.furnitureAndInterior },
                    { id: '자동차', value:categoryCounts.automotive  },
                    { id: '스포츠용품', value: categoryCounts.sportsAndLeisure},
                    { id: '아동용품', value: categoryCounts.kidsItems },
                    { id: '도서및 문구용품', value: categoryCounts.booksAndStationery },
                    { id: '신발', value: categoryCounts.shoes },
                    { id: '악세서리', value:categoryCounts.accessoriesAndJewelry },
                    { id: '화장품', value: categoryCounts.beautyAndCosmetics},
                ]}

            //     data={[
            //       { id: '의류', value: 200 },
            //       { id: '가전제품', value: 150 },
            //       { id: '가구/인테리어', value:100 },
            //       { id: '자동차', value:50 },
            //       { id: '스포츠용품', value:80},
            //       { id: '아동용품', value: 150},
            //       { id: '도서및 문구용품', value: 100},
            //       { id: '신발', value:120 },
            //       { id: '악세서리', value:110 },
            //       { id: '화장품', value: 50},
            //   ]}
                /**
                 * chart margin
                 */
                margin={{ top: 20, right:160, bottom: 80, left: 80 }}
                /**
                 * chart 중간 빈공간 반지름
                 */
                innerRadius={0.5}
                /**
                 * pad 간격
                 */
                padAngle={1.8}
                /**
                 * pad radius 설정 (pad별 간격이 있을 시 보임)
                 */
                cornerRadius={8}
                /**
                 * chart 색상
                 */
                colors={['#FF8A3D', '#368AFF', 'violet']} // 커스터하여 사용할 때
                // colors={{ scheme: 'nivo' }} // nivo에서 제공해주는 색상 조합 사용할 때
                /**
                 * pad border 두께 설정
                 */
                borderWidth={2}
                /**
                 * link label skip할 기준 각도
                 */
                arcLinkLabelsSkipAngle={0}
                /**
                 * link label 색상
                 */
                arcLinkLabelsTextColor="#000000"
                /**
                 * link label 연결되는 선 두께
                 */
                arcLinkLabelsThickness={2}
                /**
                 * link label 연결되는 선 색상
                 */
                arcLinkLabelsColor={{ from: 'color' }} // pad 색상에 따라감
                /**
                 * label (pad에 표현되는 글씨) skip할 기준 각도
                 */
                arcLabelsSkipAngle={10}
                theme={{
                    /**
                     * label style (pad에 표현되는 글씨)
                     */
                    labels: {
                        text: {
                            fontSize: 14,
                            fill: '#000000',
                        },
                    },
                    /**
                     * legend style (default로 하단에 있는 색상별 key 표시)
                     */
                    legends: {
                        text: {
                            fontSize: 8,
                            fill: '#000000',
                        },
                    },
                }}
                /**
                 * pad 클릭 이벤트
                 */
                onClick={handle.padClick}
                /**
                 * legend 설정 (default로 하단에 있는 색상별 key 표시)
                 */

            />
        </div>


        <div style={{ width: '1000px', height: '400px', margin: '0 auto' }}>
            <ResponsiveBar
                /**
                 * chart에 사용될 데이터
                 */
                data={[
                    { bottle:'의류', 거래중: clothingFalse, 거래완료: clothingTrue},
                    { bottle:'가전제품', 거래중: electronicsFalse, 거래완료: electronicsTrue},
                    { bottle:'가구', 거래중:furnitureAndInteriorFalse , 거래완료: furnitureAndInteriorTrue},
                    { bottle:'자동차', 거래중: automotiveFalse, 거래완료: automotiveTrue},
                    { bottle:'스포츠', 거래중: sportsAndLeisureFalse, 거래완료: sportsAndLeisureTrue},
                    { bottle:'아동용품', 거래중: kidsItemsFalse, 거래완료: kidsItemsTrue},
                    { bottle:'도서', 거래중: booksAndStationeryFalse, 거래완료: booksAndStationeryTrue},
                    { bottle:'신발', 거래중: shoesFalse, 거래완료: shoesTrue},
                    { bottle:'악세서리', 거래중: accessoriesAndJewelryFalse, 거래완료: accessoriesAndJewelryTrue},
                    { bottle:'화장품', 거래중: beautyAndCosmeticsFalse, 거래완료: beautyAndCosmeticsTrue},

                ]}
                /**
                 * chart에 보여질 데이터 key (측정되는 값)
                 */
                keys={['거래중', '거래완료']}
                /**
                 * keys들을 그룹화하는 index key (분류하는 값)
                 */
                indexBy="bottle"
                /**
                 * chart margin
                 */
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                /**
                 * chart padding (bar간 간격)
                 */
                padding={0.3}
                /**
                 * chart 색상
                 */
                colors={['#FF8A3D', '#368AFF', 'violet']} // 커스터하여 사용할 때
                // colors={{ scheme: 'nivo' }} // nivo에서 제공해주는 색상 조합 사용할 때
                /**
                 * color 적용 방식
                 */
                colorBy="id" // 색상을 keys 요소들에 각각 적용
                // colorBy="indexValue" // indexBy로 묵인 인덱스별로 각각 적용
                theme={{
                    /**
                     * label style (bar에 표현되는 글씨)
                     */
                    labels: {
                        text: {
                            fontSize: 14,
                            fill: '#000000',
                        },
                    },
                    /**
                     * legend style (default로 우측 하단에 있는 색상별 key 표시)
                     */
                    legends: {
                        text: {
                            fontSize: 12,
                            fill: '#000000',
                        },
                    },
                    axis: {
                        /**
                         * axis legend style (bottom, left에 있는 글씨)
                         */
                        legend: {
                            text: {
                                fontSize: 20,
                                fill: '#000000',
                            },
                        },
                        /**
                         * axis ticks style (bottom, left에 있는 값)
                         */
                        ticks: {
                            text: {
                                fontSize: 16,
                                fill: '#000000',
                            },
                        },
                    },
                }}
                /**
                 * axis bottom 설정
                 */
                axisBottom={{
                    tickSize: 5, // 값 설명하기 위해 튀어나오는 점 크기
                    tickPadding: 5, // tick padding
                    tickRotation: 0, // tick 기울기
                    legend: '유저수', // bottom 글씨
                    legendPosition: 'middle', // 글씨 위치
                    legendOffset: 40, // 글씨와 chart간 간격
                }}
                /**
                 * axis left 설정
                 */
                axisLeft={{
                    tickSize: 5, // 값 설명하기 위해 튀어나오는 점 크기
                    tickPadding: 5, // tick padding
                    tickRotation: 0, // tick 기울기
                    legend: '', // left 글씨
                    legendPosition: 'middle', // 글씨 위치
                    legendOffset: -60, // 글씨와 chart간 간격
                }}
                /**
                 * label 안보이게 할 기준 width
                 */
                labelSkipWidth={36}
                /**
                 * label 안보이게 할 기준 height
                 */
                labelSkipHeight={12}
                /**
                 * bar 클릭 이벤트
                 */
                onClick={handle.barClick}
                /**
                 * legend 설정 (default로 우측 하단에 있는 색상별 key 표시)
                 */
                legends={[
                    {
                        dataFrom: 'keys', // 보일 데이터 형태
                        anchor: 'bottom-right', // 위치
                        direction: 'column', // item 그려지는 방향
                        justify: false, // 글씨, 색상간 간격 justify 적용 여부
                        translateX: 120, // chart와 X 간격
                        translateY: 0, // chart와 Y 간격
                        itemsSpacing: 2, // item간 간격
                        itemWidth: 100, // item width
                        itemHeight: 20, // item height
                        itemDirection: 'left-to-right', // item 내부에 그려지는 방향
                        itemOpacity: 0.85, // item opacity
                        symbolSize: 20, // symbol (색상 표기) 크기
                        effects: [
                            {
                                // 추가 효과 설정 (hover하면 item opacity 1로 변경)
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                        onClick: handle.legendClick, // legend 클릭 이벤트
                    },
                ]}
            />
        </div>
      


        </div>



    );
};

export default AdminDashboard;