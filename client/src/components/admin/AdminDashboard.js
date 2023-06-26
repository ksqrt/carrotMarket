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
  barClick: (data: any) => {
      console.log(data);
  },

  legendClick: (data: any) => {
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
                // data={[
                //     { id: '의류', value: categoryCounts.clothing },
                //     { id: '가전제품', value: categoryCounts.electronics },
                //     { id: '가구/인테리어', value:categoryCounts.furnitureAndInterior },
                //     { id: '자동차', value:categoryCounts.automotive  },
                //     { id: '스포츠용품', value: categoryCounts.sportsAndLeisure},
                //     { id: '아동용품', value: categoryCounts.kidsItems },
                //     { id: '도서및 문구용품', value: categoryCounts.booksAndStationery },
                //     { id: '신발', value: categoryCounts.shoes },
                //     { id: '악세서리', value:categoryCounts.accessoriesAndJewelry },
                //     { id: '화장품', value: categoryCounts.beautyAndCosmetics},
                // ]}

                data={[
                  { id: '의류', value: 200 },
                  { id: '가전제품', value: 150 },
                  { id: '가구/인테리어', value:100 },
                  { id: '자동차', value:50 },
                  { id: '스포츠용품', value:80},
                  { id: '아동용품', value: 150},
                  { id: '도서및 문구용품', value: 100},
                  { id: '신발', value:120 },
                  { id: '악세서리', value:110 },
                  { id: '화장품', value: 50},
              ]}
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
                colors={['olive', 'brown', 'orange']} // 커스터하여 사용할 때
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



        <div style={{ width: '800px', height: '400px', margin: '0 auto' }}>
            <ResponsiveBar
                /**
                 * chart에 사용될 데이터
                 */
                data={[
                    { bottle:'성별유저수', 여성: 1200, 남성: 1000},
                   
                ]}
                /**
                 * chart에 보여질 데이터 key (측정되는 값)
                 */
                keys={['여성', '남성']}
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
                colors={['olive', 'brown', 'orange']} // 커스터하여 사용할 때
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